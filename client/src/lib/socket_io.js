// lib/socket_io.js
import { io } from 'socket.io-client';

const serverUrl = import.meta.env.VITE_ROOT_SERVER || "http://localhost:5000";
console.log("🔗 Connecting to Socket.IO server:", serverUrl);

// Remove any trailing slashes and ensure clean URL
const cleanServerUrl = serverUrl.replace(/\/$/, '');

export const socket = io(cleanServerUrl, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: false,
  withCredentials: true,
});

// Debug listeners
socket.on("connect", () => {
  console.log("✅ Socket connected with ID:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.error("🔥 Socket connection error:", error);
  console.error("Error details:", {
    message: error.message,
    description: error.description,
    context: error.context
  });
});

export const connectSocket = () => {
  console.log("🔄 Manual connection attempt...");
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  console.log("🔌 Manual disconnection...");
  socket.disconnect();
};