import { useCallback, useEffect, useRef, useState } from "react";
import api from "../api/axios";
import "./AiService.css";

const AI_PORT = "9000";
const CHAT_ID = "servio-ai";
const WELCOME_MESSAGE = {
  id: "welcome",
  sender: "assistant",
  text: "Hello! I'm your SERVIO intelligent assistant. I can help you with event details, worker availability, venue locations, upcoming dates, and much more. What would you like to know?",
  meta: "SERVIO AI",
};

const SUGGESTION_CHIPS = [
  "Available slots this weekend",
  "Upcoming events in June",
  "Nearest venue location",
  "Book a caterer",
];

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
      if (!response.ok) throw new Error(data.detail || "AI service request failed");
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
  const textareaRef = useRef(null);

  const appendMessage = useCallback((message) => {
    setMessages((current) => [
      ...current,
      { id: `${Date.now()}-${current.length}`, ...message },
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
        } catch {
          resolvedUserId = "guest";
        }

        setUserId(resolvedUserId);

        try {
          const { data } = await fetchJson(
            `/chat/${encodeURIComponent(resolvedUserId)}?chat_id=${encodeURIComponent(CHAT_ID)}`
          );
          if (!mounted) return;

          const savedMessages = (data.messages || []).map((item) => ({
            id: item.created_at,
            sender: item.role === "user" ? "user" : "assistant",
            text: item.message,
            meta: item.role === "user" ? "You" : "SERVIO AI",
          }));

          setMessages(savedMessages.length ? savedMessages : [WELCOME_MESSAGE]);
        } catch {
          if (!mounted) return;
          setMessages([WELCOME_MESSAGE]);
        }

        setStatus("Ready");
      } catch (error) {
        if (!mounted) return;
        setStatus("Offline");
        appendMessage({ sender: "assistant error", text: error.message, meta: "Connection" });
      }
    };

    initializeChat();
    return () => { mounted = false; };
  }, [appendMessage]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const askAi = async () => {
    const userQuestion = question.trim();
    if (!userQuestion) return;

    appendMessage({ sender: "user", text: userQuestion, meta: "You" });
    setQuestion("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);
    setStatus("Thinking...");

    try {
      const { data } = await fetchJson("/ask", {
        method: "POST",
        body: JSON.stringify({
          question: userQuestion,
          provider: "groq",
          use_graph: true,
          user_id: userId,
          chat_id: CHAT_ID,
        }),
      });
      appendMessage({ sender: "assistant", text: data.answer, meta: "SERVIO AI" });
      setStatus("Ready");
    } catch (error) {
      appendMessage({ sender: "assistant error", text: error.message, meta: "Connection" });
      setStatus("Connection issue");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askAi();
    }
  };

  const handleInput = (e) => {
    setQuestion(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const handleChipClick = (chip) => {
    setQuestion(chip);
    textareaRef.current?.focus();
  };

  const statusClass =
    status === "Ready" ? "online" : status === "Offline" ? "offline" : "working";

  const now = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <main className="ai-page">
      {/* Background decorations */}
      <div className="ai-bg-blob1" />
      <div className="ai-bg-blob2" />
      <div className="ai-bg-dots" />

      <div className="ai-page-inner">

        {/* Top badge */}
        <div className="ai-top-badge">
          <span className="ai-badge-dot" />
          Powered by Groq · Neural Intelligence
        </div>

        {/* Heading */}
        <div className="ai-heading">
          <h1>SERVIO <span className="ai-gradient-text">AI Assistant</span></h1>
          <p>Your intelligent co-pilot for events, bookings, staff slots, and scheduling — always on, always fast.</p>
        </div>

        {/* Capability pills */}
        <div className="ai-caps">
          {["🧠 Event Intelligence", "📅 Date & Scheduling", "👷 Worker Slots", "📍 Locations", "⚡ Instant Answers"].map((cap) => (
            <div className="ai-cap-pill" key={cap}>{cap}</div>
          ))}
        </div>

        {/* Chat shell */}
        <section className="ai-chat-shell" aria-label="SERVIO AI chat">

          {/* Header */}
          <header className="ai-chat-header">
            <div className="ai-header-left">
              <div className="ai-avatar-wrap">
                <div className="ai-avatar">AI</div>
                <div className="ai-avatar-ring" />
              </div>
              <div className="ai-header-info">
                <h2>SERVIO AI</h2>
                <div className="ai-header-sub">
                  <span className={`ai-status-dot ${statusClass}`} />
                  {status}
                </div>
              </div>
            </div>
            <div className="ai-header-right">
              <div className="ai-hdr-chip">⚡ Groq · Ultra-fast</div>
              <div className="ai-hdr-chip">🔒 Secure</div>
            </div>
          </header>

          {/* Neural animated bar */}
          <div className="ai-neural-bar" />

          {/* Context suggestions */}
          <div className="ai-context-strip">
            <span className="ai-ctx-label">Try asking:</span>
            {SUGGESTION_CHIPS.map((chip) => (
              <button key={chip} className="ai-ctx-chip" onClick={() => handleChipClick(chip)}>
                {chip}
              </button>
            ))}
          </div>

          {/* Chat body */}
          <div className="ai-chat-body" aria-live="polite">
            <div className="ai-date-chip">{now}</div>

            {messages.map((message) => (
              <article
                key={message.id}
                className={`ai-msg-row ${message.sender.includes("user") ? "from-user" : "from-ai"}`}
              >
                {/* Welcome message gets special treatment */}
                {message.id === "welcome" ? (
                  <div className="ai-welcome-bubble">
                    <div className="ai-welcome-top">
                      <div className="ai-welcome-icon">🤖</div>
                      <span className="ai-welcome-name">SERVIO AI</span>
                    </div>
                    <p>{message.text}</p>
                    <div className="ai-welcome-chips">
                      {["📅 Upcoming events", "👥 Worker slots", "📍 Locations", "🍽️ Catering"].map((c) => (
                        <button key={c} className="ai-wc-chip" onClick={() => handleChipClick(c.replace(/^[^\s]+\s/, ""))}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={`ai-bubble ${message.sender.includes("error") ? "is-error" : ""}`}>
                    <p>{message.text}</p>
                    <small className="ai-bubble-meta">
                      {message.sender.includes("user") ? "You" : "✦ SERVIO AI"}
                    </small>
                  </div>
                )}
              </article>
            ))}

            {loading && (
              <article className="ai-msg-row from-ai">
                <div className="ai-typing-bubble" aria-label="AI is typing">
                  <span />
                  <span />
                  <span />
                </div>
              </article>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Composer */}
          <div className="ai-composer">
            <div className="ai-composer-inner">
              <textarea
                ref={textareaRef}
                className="ai-textarea"
                value={question}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Ask SERVIO AI about events, slots, venues..."
                rows={1}
              />
              <button
                className="ai-send-btn"
                onClick={askAi}
                disabled={loading}
                aria-label="Send message"
              >
                {loading ? (
                  <span className="ai-send-spinner" />
                ) : (
                  <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="ai-composer-hint">↵ Enter to send · Shift+Enter for new line</p>
          </div>

        </section>

        {/* Stats strip */}
        <div className="ai-stats-strip">
          {[
            { num: "~0.3s", lbl: "Response time" },
            { num: "24/7", lbl: "Always on" },
            { num: "100%", lbl: "SERVIO data" },
            { num: "Groq", lbl: "Powered by" },
          ].map((s) => (
            <div className="ai-stat-card" key={s.lbl}>
              <span className="ai-stat-num">{s.num}</span>
              <span className="ai-stat-lbl">{s.lbl}</span>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
