import { WS_URL } from "./config";

export function createWebSocket({ onOpen, onClose, onMessage, onError }) {
  let socket = null;
  let reconnectTimeout = null;
  let reconnectAttempts = 0;
  const maxAttempts = 10;
  const reconnectDelayMs = 4000;
  const url = WS_URL;

  const scheduleReconnect = () => {
    if (reconnectAttempts < maxAttempts) {
      reconnectAttempts += 1;
      reconnectTimeout = window.setTimeout(connect, reconnectDelayMs);
    }
  };

  const connect = () => {
    socket = new WebSocket(url);

    socket.onopen = () => {
      reconnectAttempts = 0;
      onOpen?.();
    };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        onMessage?.(payload);
      } catch (error) {
        console.error("Failed to parse WebSocket message", error);
      }
    };

    socket.onclose = (event) => {
      onClose?.(event);
      scheduleReconnect();
    };

    socket.onerror = (event) => {
      onError?.(event);
      if (socket && socket.readyState !== WebSocket.CLOSING && socket.readyState !== WebSocket.CLOSED) {
        socket.close();
      }
    };
  };

  connect();

  return {
    sendMessage: (payload) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(payload));
      }
    },
    close: () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      socket?.close();
    },
  };
}
