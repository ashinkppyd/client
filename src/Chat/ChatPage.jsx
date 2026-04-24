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
  const location = useLocation();
  const navigate = useNavigate();

  const receiverId = location.state?.receiver_id;
  const receiverRole = location.state?.receiver_role;

  if (!receiverId) {
    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        <h3>💬 No chat selected</h3>
        <button onClick={() => navigate(-1)}>⬅ Go Back</button>
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

    const tempMessage = {
      id: tempId,
      message,
      sender_name: "You",
      is_me: true,
    };

    
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
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>💬 Chat</h3>
        <span>{status}</span>
      </div>

      <div className="chat-window" ref={scrollRef}>
        {messages.map((m, i) => (
          <div
            key={m.id || i}
            style={{
              padding: "8px",
              margin: "5px",
              borderRadius: "8px",
              background: m.is_me ? "#d1ffd6" : "#f1f1f1",
              textAlign: m.is_me ? "right" : "left",
            }}
          >
            <b>{m.is_me ? "You" : m.sender_name}:</b> {m.message}
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatPage;