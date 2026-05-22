import { useEffect, useMemo, useState } from "react";
import { createWebSocket } from "../services/websocket";

const eventOrder = ["track_play", "ai_speech", "queue_update", "announcement", "chat_message"];

export function useWebSocket() {
  const [status, setStatus] = useState("connecting");
  const [events, setEvents] = useState([]);
  const [listeners, setListeners] = useState(0);
  const [latestMessage, setLatestMessage] = useState(null);

  const socket = useMemo(() => {
    return createWebSocket({
      onOpen: () => setStatus("connected"),
      onClose: () => setStatus("disconnected"),
      onError: () => setStatus("error"),
      onMessage: (payload) => {
        setLatestMessage(payload);
        setEvents((previous) => [payload, ...previous].slice(0, 50));

        if (payload.type === "listener_count") {
          setListeners(payload.count || 0);
        }
      },
    });
  }, []);

  useEffect(() => {
    return () => socket.close();
  }, [socket]);

  const sendMessage = (message) => {
    socket.sendMessage({ type: "chat", text: message });
  };

  const orderedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      return (
        eventOrder.indexOf(a.type || "") - eventOrder.indexOf(b.type || "")
      );
    });
  }, [events]);

  return {
    status,
    events: orderedEvents,
    latestMessage,
    listeners,
    sendMessage,
  };
}
