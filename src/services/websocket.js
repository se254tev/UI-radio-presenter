const getWebSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:10000";
  const url = new URL(apiUrl.replace(/^http/, "ws"));
  url.pathname = "/ws/radio";
  return url.toString();
};

export function createWebSocket({ onOpen, onClose, onMessage, onError }) {
  let socket = null;
  let reconnectTimeout = null;
  let reconnectAttempts = 0;
  const maxAttempts = 10;
  const url = getWebSocketUrl();

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

    socket.onclose = () => {
      onClose?.();
      if (reconnectAttempts < maxAttempts) {
        reconnectAttempts += 1;
        reconnectTimeout = window.setTimeout(connect, 1000 * reconnectAttempts);
      }
    };

    socket.onerror = (event) => {
      onError?.(event);
      socket.close();
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
