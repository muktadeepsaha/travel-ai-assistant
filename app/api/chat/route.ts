
// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { SYSTEM_PROMPT } from "@/prompts";
import {
  travelSearchTool,
  TravelSearchInput
} from "@/lib/travelTools";
import { MODERATION_DENIAL_MESSAGE_GENERIC } from "@/config";

export const runtime = "edge";

type ChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  name?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userMessages: ChatMessage[] = body.messages ?? [];

    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...userMessages
    ];

    const lastUserContent =
      [...userMessages].reverse().find(m => m.role === "user")?.content || "";

    const shouldCallTool =
      /price|cheapest|cost|flight|hotel|local transport|cab|taxi|uber|ola|airbnb/i.test(
        lastUserContent
      );

    let toolSummary = "";

    if (shouldCallTool) {
      const destinationMatch = lastUserContent.match(
        /to\s+([A-Za-z\s]+?)(?:\s|$|,|\.)/
      );
      const destination = destinationMatch?.[1]?.trim() || "";

      const toolInput: TravelSearchInput = {
        destination
      };

      const toolResult = await travelSearchTool(toolInput);
      toolSummary = JSON.stringify(toolResult, null, 2);

      messages.push({
        role: "assistant",
        content:
          "I have fetched candidate flights, hotels, and local transport options using travel_search. I will now analyze them.",
        name: "tool"
      });

      messages.push({
        role: "user",
        content: `Here is the JSON result from the travel_search tool:
${toolSummary}`
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      })),
      temperature: 0.6
    });

    const answer =
      completion.choices[0].message?.content ??
      MODERATION_DENIAL_MESSAGE_GENERIC;

    return NextResponse.json({ answer, toolUsed: !!toolSummary, toolSummary });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      {
        error: "Something went wrong generating a response.",
        details: err?.message
      },
      { status: 500 }
    );
  }
}
