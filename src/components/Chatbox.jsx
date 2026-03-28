"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function ChatbotWidget() {
  const { t, i18n } = useTranslation("common");

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => [
    { role: "system", content: t("systemGreeting") }
  ]);
  const [loading, setLoading] = useState(false);

  // Language change: reset system message without infinite loop
  useEffect(() => {
    setMessages([{ role: "system", content: t("systemGreeting") }]);
  }, [i18n.language]);

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
          { role: "system", content: t("errorDefault") },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "system", content: t("errorServer") },
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
          {t("chatbotToggle")}
        </button>
      )}

      {open && (
        <div className="chatbot-widget">
          <div className="chatbot-header">
            <span>{t("chatbotHeader")}</span>
            <button onClick={() => setOpen(false)}>{t("closeButton")}</button>
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
              placeholder={t("chatbotPlaceholder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading}>
              {t("sendButton")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
