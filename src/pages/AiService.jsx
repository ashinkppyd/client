import { useCallback, useEffect, useRef, useState } from "react";
import api from "../api/axios";
import "./AiService.css";

const AI_PORT = "9000";
const CHAT_ID = "servio-ai";
const WELCOME_MESSAGE = {
  id: "welcome",
  sender: "assistant",
  text: "Ask about SERVIO events, worker slots, locations, dates, or availability.",
  meta: "SERVIO AI",
};

const getAiUrls = () => {
  if (import.meta.env.VITE_AI_SERVICE_URL) {
    return [import.meta.env.VITE_AI_SERVICE_URL];
  }

  const host = window.location.hostname || "localhost";
  return [`http://${host}:${AI_PORT}`, `http://127.0.0.1:${AI_PORT}`];
};

async function fetchJson(path, options = {}) {
  const urls = getAiUrls();
  let lastError;

  for (const baseUrl of urls) {
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: { "Content-Type": "application/json", ...options.headers },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "AI service request failed");
      }

      return { data, baseUrl };
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(lastError?.message || "AI service unreachable.");
}

export default function AiService() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Checking connection...");
  const [userId, setUserId] = useState("guest");
  const chatEndRef = useRef(null);

  const appendMessage = useCallback((message) => {
    setMessages((current) => [
      ...current,
      {
        id: `${Date.now()}-${current.length}`,
        ...message,
      },
    ]);
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeChat = async () => {
      try {
        await fetchJson("/health");
        if (!mounted) return;

        let resolvedUserId = "guest";
        try {
          const userResponse = await api.get("/me/");
          resolvedUserId = String(userResponse.data?.id || "guest");
        } catch (error) {
          resolvedUserId = "guest";
        }

        setUserId(resolvedUserId);

        try {
          const { data } = await fetchJson(
            `/chat/${encodeURIComponent(resolvedUserId)}?chat_id=${encodeURIComponent(
              CHAT_ID
            )}`
          );
          if (!mounted) return;

          const savedMessages = (data.messages || []).map((item) => ({
            id: item.created_at,
            sender: item.role === "user" ? "user" : "assistant",
            text: item.message,
            meta: item.role === "user" ? "You" : "SERVIO AI",
          }));

          setMessages(savedMessages.length ? savedMessages : [WELCOME_MESSAGE]);
        } catch (error) {
          if (!mounted) return;
          setMessages([WELCOME_MESSAGE]);
        }

        setStatus("Ready");
      } catch (error) {
        if (!mounted) return;
        setStatus("Offline");
        appendMessage({
          sender: "assistant",
          text: error.message,
          meta: "Connection",
        });
      }
    };

    initializeChat();

    return () => {
      mounted = false;
    };
  }, [appendMessage]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const askAi = async () => {
    const userQuestion = question.trim();

    if (!userQuestion) {
      setStatus("Please enter a question.");
      return;
    }

    appendMessage({
      sender: "user",
      text: userQuestion,
      meta: "You",
    });
    setQuestion("");
    setLoading(true);
    setStatus("Thinking...");

    try {
      const { data } = await fetchJson("/ask", {
        method: "POST",
        body: JSON.stringify({
          question: userQuestion,
          provider: "groq",
          user_id: userId,
          chat_id: CHAT_ID,
        }),
      });

      appendMessage({
        sender: "assistant",
        text: data.answer,
        meta: "SERVIO AI",
      });
      setStatus("Ready");
    } catch (error) {
      appendMessage({
        sender: "assistant error",
        text: error.message,
        meta: "Connection",
      });
      setStatus("Connection issue");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    askAi();
  };

  const handleTextareaKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      askAi();
    }
  };

  const statusClass =
    status === "Ready" ? "online" : status === "Offline" ? "offline" : "working";

  return (
    <main className="ai-page">
      <section className="ai-chat-shell" aria-label="SERVIO AI chat">
        <header className="ai-chat-header">
          <div className="ai-chat-profile">
            <div className="ai-avatar" aria-hidden="true">
              AI
            </div>
            <div>
              <h1>SERVIO AI</h1>
              <p>
                <span className={`status-indicator ${statusClass}`}></span>
                {status}
              </p>
            </div>
          </div>

        </header>

        <section className="ai-chat-body" aria-live="polite">
          <div className="ai-date-chip">Today</div>

          {messages.map((message) => (
            <article
              className={`ai-message-row ${
                message.sender.includes("user") ? "from-user" : "from-ai"
              }`}
              key={message.id}
            >
              <div
                className={`ai-bubble ${
                  message.sender.includes("error") ? "is-error" : ""
                }`}
              >
                <p>{message.text}</p>
                <small className="ai-message-meta">{message.meta}</small>
              </div>
            </article>
          ))}

          {loading && (
            <article className="ai-message-row from-ai">
              <div className="ai-bubble ai-typing" aria-label="AI is typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </article>
          )}

          <div ref={chatEndRef}></div>
        </section>

        <form className="ai-composer" onSubmit={handleSubmit}>
          <textarea
            className="ai-textarea"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={handleTextareaKeyDown}
            placeholder="Ask SERVIO AI..."
            rows="1"
          />
          <button className="ai-send-btn" type="submit" disabled={loading}>
            {loading ? "Wait" : "Send"}
          </button>
        </form>
      </section>
    </main>
  );
}
