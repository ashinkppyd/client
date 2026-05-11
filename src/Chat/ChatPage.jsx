import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ChatPage.css";
import API from "../api/axios";

function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("Connecting...");

  const socket = useRef(null);
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const receiverId = location.state?.receiver_id;
  const receiverRole = location.state?.receiver_role;
  const receiverName = location.state?.receiver_name || "Chat";

  if (!receiverId) {
    return (
      <div className="chat-empty-state">
        <div className="chat-empty-card">
          <div className="chat-empty-icon">💬</div>
          <h3>No chat selected</h3>
          <p>Select a conversation to start messaging</p>
          <button className="chat-back-btn" onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    API.get(`/history/?receiver_id=${receiverId}&receiver_role=${receiverRole}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.log(err));
  }, [receiverId, receiverRole]);

  useEffect(() => {
    if (!receiverId) return;

    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${receiverId}/`);
    socket.current = ws;

    ws.onopen = () => setStatus("Connected");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => {
        const index = prev.findIndex((m) => m.id === data.temp_id);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = data;
          return updated;
        }
        const exists = prev.some((m) => m.id === data.id);
        return exists ? prev : [...prev, data];
      });
    };

    ws.onerror = () => setStatus("Error");
    ws.onclose = () => setStatus("Disconnected");

    return () => ws.close();
  }, [receiverId]);

  const sendMessage = () => {
    if (socket.current?.readyState !== WebSocket.OPEN) return;
    if (!message.trim()) return;

    const tempId = Date.now();
    const tempMessage = { id: tempId, message, sender_name: "You", is_me: true };

    setMessages((prev) => [...prev, tempMessage]);

    socket.current.send(
      JSON.stringify({
        message,
        receiver_id: receiverId,
        receiver_role: receiverRole,
        temp_id: tempId,
      })
    );

    setMessage("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInput = (e) => {
    setMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const statusClass =
    status === "Connected" ? "online" : status === "Error" ? "error" : "away";

  const initials = receiverName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <div className="chat-page">
      <div className="chat-bg-blob1" />
      <div className="chat-bg-blob2" />
      <div className="chat-bg-dots" />

      <div className="chat-container">

        {/* Header */}
        <header className="chat-header">
          <div className="chat-header-left">
            <button className="chat-nav-back" onClick={() => navigate(-1)} aria-label="Go back">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </button>
            <div className="chat-avatar-wrap">
              <div className="chat-avatar">{initials}</div>
              <span className={`chat-avatar-status ${statusClass}`} />
            </div>
            <div className="chat-header-info">
              <h2>{receiverName}</h2>
              <div className="chat-header-sub">
                <span className={`chat-status-dot ${statusClass}`} />
                {status}
              </div>
            </div>
          </div>
          <div className="chat-header-right">
            <div className="chat-role-chip">{receiverRole}</div>
          </div>
        </header>

        {/* Neural bar */}
        <div className="chat-neural-bar" />

        {/* Messages */}
        <div className="chat-window" ref={scrollRef}>
          <div className="chat-date-chip">{today}</div>

          {messages.length === 0 && (
            <div className="chat-no-messages">
              <div className="chat-no-icon">💬</div>
              <p>No messages yet. Say hello!</p>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={m.id || i}
              className={`chat-msg-row ${m.is_me ? "from-me" : "from-them"}`}
            >
              {!m.is_me && (
                <div className="chat-msg-avatar">{(m.sender_name || "?")[0].toUpperCase()}</div>
              )}
              <div className="chat-bubble-wrap">
                {!m.is_me && (
                  <span className="chat-sender-name">{m.sender_name}</span>
                )}
                <div className={`chat-bubble ${m.is_me ? "mine" : "theirs"}`}>
                  <p>{m.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Composer */}
        <div className="chat-composer">
          <div className="chat-composer-inner">
            <textarea
              ref={textareaRef}
              className="chat-textarea"
              value={message}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
            />
            <button
              className="chat-send-btn"
              onClick={sendMessage}
              disabled={!message.trim()}
              aria-label="Send"
            >
              <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
          <p className="chat-composer-hint">↵ Enter to send · Shift+Enter for new line</p>
        </div>

      </div>
    </div>
  );
}

export default ChatPage;