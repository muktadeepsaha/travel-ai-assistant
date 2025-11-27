
// app/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { AI_NAME, WELCOME_MESSAGE, CLEAR_CHAT_TEXT } from "@/config";

type UiMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function Page() {
  const [messages, setMessages] = useState<UiMessage[]>([
    { role: "assistant", content: WELCOME_MESSAGE }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages: UiMessage[] = [
      ...messages,
      { role: "user", content: input }
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      const data = await res.json();

      if (data.answer) {
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: data.answer
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content:
              "Sorry, I had trouble generating a response. Please try again."
          }
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content:
            "Network or server error while talking to the AI. Please try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setMessages([{ role: "assistant", content: WELCOME_MESSAGE }]);
  }

  return (
    <main className="main-container">
      <div className="card">
        <div style={{ marginBottom: "1rem" }}>
          <div className="badge">🚀 {AI_NAME} · AI Travel Planner</div>
          <h1 style={{ fontSize: "1.7rem", marginBottom: "0.5rem" }}>
            Plan your next trip in one chat
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "0.95rem" }}>
            Tell me your origin, destination, dates, budget, and preferences.
            I’ll suggest flights, hotels, local transport, and a day-by-day
            itinerary.
          </p>
        </div>

        <div className="chat-window">
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                "message " +
                (m.role === "user" ? "message-user" : "message-assistant")
              }
            >
              <strong>{m.role === "user" ? "You" : AI_NAME}:</strong>{" "}
              <span>{m.content}</span>
            </div>
          ))}
          {loading && (
            <div className="message message-assistant">
              <strong>{AI_NAME}:</strong> Thinking about the best options for
              you…
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            marginTop: "1rem",
            display: "flex",
            gap: "0.5rem",
            alignItems: "center"
          }}
        >
          <button
            type="button"
            onClick={handleClear}
            style={{
              padding: "0.5rem 0.9rem",
              borderRadius: "9999px",
              border: "1px solid rgba(148, 163, 184, 0.6)",
              background: "transparent",
              color: "#e5e7eb",
              fontSize: "0.85rem",
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
          >
            {CLEAR_CHAT_TEXT}
          </button>

          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="e.g., Plan a 5-day budget trip from Mumbai to Bali in March for 2 people…"
            style={{
              flex: 1,
              padding: "0.6rem 0.8rem",
              borderRadius: "9999px",
              border: "1px solid rgba(148, 163, 184, 0.6)",
              background: "#020617",
              color: "#e5e7eb",
              fontSize: "0.95rem"
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.6rem 1.1rem",
              borderRadius: "9999px",
              border: "none",
              background: loading ? "#4b5563" : "#22c55e",
              color: "#020617",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Planning…" : "Ask"}
          </button>
        </form>
      </div>
    </main>
  );
}

