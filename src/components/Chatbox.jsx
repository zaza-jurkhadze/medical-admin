"use client";
import { useState } from "react";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "system", content: "გამარჯობა! რით შემიძლია დაგეხმაროთ?" },
  ]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (data.result?.role && data.result?.content) {
        setMessages((prev) => [...prev, data.result]);
      } else if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "system", content: `შეცდომა: ${data.error}` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "system", content: "შეცდომა მოხდა." },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "system", content: "სერვერის შეცდომა." },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  }

  return (
    <div>
      {!open && (
        <button className="chatbot-toggle" onClick={() => setOpen(true)}>
          💬
        </button>
      )}

      {open && (
        <div className="chatbot-widget">
          <div className="chatbot-header">
            <span>მედ-ასისტენტი</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>
          <div className="messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                {msg.content}
              </div>
            ))}
          </div>
          <div className="input-area">
            <input
              type="text"
              placeholder="დაწერე..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading}>
              ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
}