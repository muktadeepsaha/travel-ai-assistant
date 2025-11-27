
%%writefile app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { SYSTEM_PROMPT } from "@/prompts";
import { MODERATION_DENIAL_MESSAGE_GENERIC } from "@/config";

export const runtime = "edge";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userMessages: ChatMessage[] = body.messages ?? [];

    // Always prepend system prompt
    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...userMessages
    ];

    let answerText: string;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        temperature: 0.6
      });

      answerText =
        completion.choices[0]?.message?.content ??
        MODERATION_DENIAL_MESSAGE_GENERIC;
    } catch (modelErr: any) {
      console.error("OpenAI API error:", modelErr);
      answerText =
        "I couldn’t reach the AI model right now (possibly due to API quota or configuration). Please try again later or ask the owner to check the OpenAI API billing and key.";
    }

    return NextResponse.json({
      answer: answerText
    });
  } catch (err: any) {
    console.error("Route /api/chat error:", err);
    return NextResponse.json(
      {
        answer:
          "Something went wrong on the server while planning your trip. Please try again later or contact the owner.",
        error: "server_error",
        details: err?.message
      },
      { status: 500 }
    );
  }
}
