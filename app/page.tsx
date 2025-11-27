
"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AI_NAME, WELCOME_MESSAGE, CLEAR_CHAT_TEXT } from "@/config";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  function scrollToBottom() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

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
    <div className="app-shell">
      <div className="app-inner">
        <header className="app-header">
          <div className="app-header-left">
            <div className="app-logo">V</div>
            <div>
              <div className="app-title">{AI_NAME}</div>
              <div className="app-subtitle">
                End-to-end AI travel planning assistant
              </div>
            </div>
          </div>
          <div className="app-badge">
            Travel · Flights · Hotels · Itineraries
          </div>
        </header>

        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={
                  "message-row " +
                  (m.role === "user" ? "user" : "assistant")
                }
              >
                <div
                  className={
                    "message-bubble " +
                    (m.role === "user" ? "user" : "assistant")
                  }
                >
                  {m.role === "assistant" ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {m.content}
                    </ReactMarkdown>
                  ) : (
                    <span>{m.content}</span>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="message-row assistant">
                <div className="message-bubble assistant">
                  Thinking about the best routes, stays, and activities for
                  you…
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chat-composer">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6
              }}
            >
              <button
                type="button"
                onClick={handleClear}
                className="chat-secondary-button"
              >
                {CLEAR_CHAT_TEXT}
              </button>
              {loading && (
                <div className="typing-indicator">
                  {AI_NAME} is planning your trip…
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="chat-composer-inner">
              <textarea
                className="chat-input"
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask anything about your trip — e.g., 'Plan a 5-day Switzerland trip from Kolkata in December with a 5 lakh budget for 2 people.'"
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // prevent newline
                    if (input.trim().length > 0 && !loading) {
                      const form = e.currentTarget.closest("form");
                      if (form) form.requestSubmit();
                    }
                  }
                }}
              />
              <button
                type="submit"
                className="chat-button"
                disabled={loading || !input.trim()}
              >
                {loading ? "Planning…" : "Send"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
