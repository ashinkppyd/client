import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import api from "../api/axios";
import "./NotificationBell.css";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const navigate = useNavigate(); 

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // 🔌 INIT
  useEffect(() => {
    let ws;

    const init = async () => {
      const res = await api.get("/me/");
      const user = res.data;

      const notesRes = await api.get("/notifications/");
      setNotifications(notesRes.data || []);
      console.log("🔔 Notifications loaded:", notesRes.data);
      ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${user.id}/`);

      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);

        if (data.type === "notification") {
          const newNote = {
            id: data.notification_id,
            message: data.message,
            is_read: false,
            time: new Date().toISOString(),
            receiver_id: data.receiver_id,
            receiver_role: data.receiver_role,
          };

          setNotifications(prev => [newNote, ...prev]);
        }
      };
    };

    init();
    return () => ws?.close();
  }, []);

  
  useEffect(() => {
    const handleClick = (e) => {
      if (!wrapperRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  
  const markAll = async () => {
    await api.post("/notifications/read-all/");
    setNotifications(prev =>
      prev.map(n => ({ ...n, is_read: true }))
    );
  };

  return (
    <div className="nb-wrapper" ref={wrapperRef}>

     
      <button
        className={`nb-bell ${open ? "active" : ""}`}
        onClick={() => setOpen(!open)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="nb-badge">{unreadCount}</span>
        )}
      </button>

      
      <div className={`nb-dropdown ${open ? "show" : ""}`}>

        <div className="nb-header">
          <span>Notifications</span>
          <button onClick={markAll}>Mark all</button>
        </div>

        <div className="nb-list">
          {notifications.length === 0 && (
            <div className="nb-empty">You're all caught up 🎉</div>
          )}

          {notifications.map((n) => (
            <div
              key={n.id}
              className={`nb-item ${!n.is_read ? "unread" : ""}`}
              onClick={async () => {
                try {
                  
                  await api.post(`/notifications/read/${n.id}/`);
                } catch (err) {
                  console.log("❌ mark read failed");
                }

              
                setOpen(false);

                
                if (n.receiver_id && n.receiver_role) {
                  navigate("/chat", {
                    state: {
                      receiver_id: n.user_id,
                      receiver_role: n.receiver_role,
                    },
                  });
                }
              }}
            >
              <div className="nb-dot" />
              <div className="nb-content">
                <p>{n.message}</p>
                <span>
                  {new Date(n.time).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default NotificationBell;