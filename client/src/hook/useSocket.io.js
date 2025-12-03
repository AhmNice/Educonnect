import { useEffect, useCallback } from "react";
import { socket } from "../lib/socket_io";



export function useSocketEvents(handlers = {}) {
  useEffect(() => {
    // Connect if not already connected
    if (!socket.connected) {
      socket.connect();
    }

    // Register all listeners
    Object.entries(handlers).forEach(([event, callback]) => {
      socket.on(event, callback);
    });

    // Cleanup: remove listeners on unmount
    return () => {
      Object.entries(handlers).forEach(([event, callback]) => {
        socket.off(event, callback);
      });
    };
  }, [handlers]);

  // Emit wrapper
  const emit = useCallback((eventName, data) => {
    console.log("⚡ emitting:", eventName, data);
    socket.emit(eventName, data);
  }, []);


  return { emit, socket };
}

