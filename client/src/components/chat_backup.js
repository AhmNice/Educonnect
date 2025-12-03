import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  MoreVertical,
  Loader2,
  ChevronLeft,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSocketEvents } from "../hook/useSocket.io";
import { socket } from "../lib/socket_io";
import { useAuthStore } from "../store/authStore";

const ChatWindow = ({ chatId, mobile }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Socket event handlers - MATCHING SERVER EVENTS
  const socketHandlers = {
    connect: () => {
      console.log("✅ ChatWindow: Socket connected!");
      setIsConnected(true);

      // Join room after connection is established
      if (chatId) {
        console.log(`🎯 Joining conversation: ${chatId}`);
        socket.emit("join_conversation", chatId);
      }
    },

    disconnect: () => {
      console.log("❌ ChatWindow: Socket disconnected!");
      setIsConnected(false);
    },

    connect_error: (error) => {
      console.error("🔥 ChatWindow: Connection error:", error);
      setIsConnected(false);
    },

    // FIXED: This matches the server's emit event
    message_received: (data) => {
      console.log("📨 Message received from server:", data);
      setMessages((prev) => [
        ...prev,
        {
          id: data.message_id,
          sender: data.user_id,
          content: data.message,
          timestamp: data.delivered_at,
        },
      ]);
    },

    // FIXED: These match the server's emit events
    user_typing: (data) => {
      console.log("⌨️ User typing:", data);
      if (data.user_id !== user?.id) {
        setIsTyping(true);
      }
    },

    user_stop_typing: (data) => {
      console.log("💤 User stopped typing:", data);
      if (data.user_id !== user?.id) {
        setIsTyping(false);
      }
    },

    // Optional: Add acknowledgement for message delivery
    message_read: (data) => {
      console.log("✅ Message read by recipient:", data);
      // Update message status in UI if needed
    }
  };

  useSocketEvents(socketHandlers);

  // Handle socket connection and room joining
  useEffect(() => {
    console.log("🚀 ChatWindow mounted, connection status:", socket.connected);

    // Set initial connection status
    setIsConnected(socket.connected);

    // If socket is not connected but we have autoConnect: true, it will connect automatically
    if (socket.connected && chatId) {
      console.log(`🎯 Socket already connected, joining room: ${chatId}`);
      socket.emit("join_conversation", chatId);
    }

    return () => {
      console.log("🧹 Cleaning up chat window...");
      // Leave room when component unmounts
      if (chatId && socket.connected) {
        socket.emit("leave_conversation", chatId);
      }

      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [chatId]);

  // Enhanced typing handler
  const handleTyping = useCallback((text) => {
    setNewMessage(text);

    if (!isConnected || !chatId || !user?.id) {
      return;
    }

    // Emit typing start
    socket.emit("user_typing", {
      conversation_id: chatId,
      user_id: user.id,
    });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("user_stop_typing", {
        conversation_id: chatId,
        user_id: user.id,
      });
    }, 1000);
  }, [isConnected, chatId, user?.id]);

  // Enhanced send message with server acknowledgement
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId || !user?.id) return;

    const tempMessage = {
      id: `temp-${Date.now()}`,
      sender: user.id,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      status: 'sending'
    };

    // Optimistically update UI
    setMessages((prev) => [...prev, tempMessage]);
    const messageToSend = newMessage.trim();
    setNewMessage("");

    try {
      // Send message with acknowledgement
      socket.emit("send_message",
        {
          conversation_id: chatId,
          message: messageToSend,
          user_id: user.id,
        },
        (acknowledgement) => {
          console.log("✅ Server acknowledgement:", acknowledgement);
          // Update the temporary message with real ID from server
          if (acknowledgement.status === "delivered") {
            setMessages(prev =>
              prev.map(msg =>
                msg.id === tempMessage.id
                  ? { ...msg, id: acknowledgement.message_id, status: 'delivered' }
                  : msg
              )
            );
          }
        }
      );

    } catch (error) {
      console.error("Error sending message:", error);
      // Remove optimistic update on error
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
      // Optionally show error to user
    }
  };

  // Fetch messages (your existing code)
  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) return;

      setIsLoading(true);
      try {
        // TODO: Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        setMessages([]); // Replace with actual data
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [chatId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white border flex-1 border-gray-200 shadow-sm flex items-center justify-center">
        <div className="text-center flex flex-col items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 mb-2" />
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border overflow-hidden h-[85.5vh] border-gray-200 shadow-sm flex flex-col flex-1">
      {/* Connection Status Indicator */}
      <div className={`px-4 py-2 text-sm text-center ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
        <div className="flex items-center justify-center space-x-2">
          {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          <span>
            {isConnected ? `Connected (${socket.id})` : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {mobile && (
            <button
              onClick={() => navigate("/messages")}
              className="p-2 hover:bg-gray-100 w-10 bg-gray-200 rounded-lg transition-colors mr-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
            SC
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Sarah Chen</h3>
            <p className="text-sm flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
              <span className={isConnected ? 'text-green-600' : 'text-gray-500'}>
                {isConnected ? 'Online' : 'Offline'}
              </span>
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="overflow-hidden flex flex-col flex-1">
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === user?.id ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${message.sender === user?.id
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-900 rounded-bl-none"
                    } ${message.status === 'sending' ? 'opacity-70' : ''}`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${message.sender === user?.id
                        ? "text-indigo-200"
                        : "text-gray-500"
                      }`}
                  >
                    {formatMessageTime(message.timestamp)}
                    {message.status === 'sending' && ' • Sending...'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-1 justify-center items-center text-gray-400">
              <p>No messages yet. Start a conversation!</p>
            </div>
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="px-4 py-2 bg-gray-100 text-gray-900 rounded-2xl rounded-bl-none">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-3"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => handleTyping(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !isConnected}
            className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;