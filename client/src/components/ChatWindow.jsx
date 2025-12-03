import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  Send,
  MoreVertical,
  Loader2,
  ChevronLeft,
  Wifi,
  WifiOff,
  Check,
  CheckCheck,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSocketEvents } from "../hook/useSocket.io";
import { socket } from "../lib/socket_io";
import { useAuthStore } from "../store/authStore";
import { socketHandlers } from "../utils/socketHandlers";
import api from "../lib/axios";

const ChatWindow = ({ chatId, mobile, setChats }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [conversationData, setConversationData] = useState();
  const [members, setMembers] = useState([]);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messageRetryRefs = useRef({});

  // In your ChatWindow component
  const handlers = useMemo(
    () =>
      socketHandlers(chatId, {
        socket,
        setChats,
        setIsConnected,
        setMessages,
        setTypingUsers,
        user,
      }),
    [chatId, user?.user_id]
  );
  const { emit } = useSocketEvents(handlers);

  useEffect(() => {
    console.log("🚀 ChatWindow mounted, connection status:", socket.connected);

    const handleConnect = () => {
      console.log("✅ Socket connected");
      setIsConnected(true);
      if (chatId) {
        console.log(`🎯 Joining room: ${chatId}`);
        socket.emit("join_conversation", {
          conversation_id: chatId,
          user_id: user.user_id,
        });
        socket.emit("all_messages_read", {
          conversation_id: chatId,
          user_id: user.user_id,
        });

        // LOCAL UI update so originator sees unread_count cleared immediately
        if (setChats) {
          setChats((prev = []) => {
            if (!Array.isArray(prev)) return prev;
            const targetId = String(chatId);
            return prev.map((chat) =>
              String(chat.conversation_id ?? chat.conversationId ?? chat.id) ===
              targetId
                ? { ...chat, unread_count: 0 }
                : chat
            );
          });
        }

        // Retry any failed messages
        retryFailedMessages();
      }
    };

    const handleDisconnect = () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    };

    // Set up event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    // Initial connection setup
    if (socket.connected && chatId) {
      console.log(`🎯 Socket already connected, joining room: ${chatId}`);
      socket.emit("join_conversation", {
        conversation_id: chatId,
        user_id: user.user_id,
      });
      // update conversation read status
      socket.emit("all_messages_read", {
        conversation_id: chatId,
        user_id: user.user_id,
      });

      // LOCAL UI update for already-connected path
      if (setChats) {
        setChats((prev = []) => {
          if (!Array.isArray(prev)) return prev;
          const targetId = String(chatId);
          return prev.map((chat) =>
            String(chat.conversation_id ?? chat.conversationId ?? chat.id) ===
            targetId
              ? { ...chat, unread_count: 0 }
              : chat
          );
        });
      }
    }

    return () => {
      console.log("🧹 Cleaning up chat window...");

      // Remove event listeners
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);

      // Leave room when component unmounts
      if (chatId && socket.connected) {
        socket.emit("leave_conversation", chatId);

        // Stop typing when leaving
        if (user?.user_id) {
          socket.emit("user_stop_typing", {
            conversation_id: chatId,
            user_id: user.user_id,
          });
        }
      }

      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Clear all retry timeouts
      Object.values(messageRetryRefs.current).forEach((timeout) => {
        clearTimeout(timeout);
      });
    };
  }, [chatId, user?.user_id]);

  // Enhanced typing handler with debouncing
  const handleTyping = useCallback(
    (text) => {
      setNewMessage(text);
      if (!isConnected || !chatId || !user?.user_id) {
        return;
      }
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // Emit typing start immediately
      emit("user_typing", {
        conversation_id: chatId,
        user_id: user.user_id,
      });
      // Set timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        emit("user_stop_typing", {
          conversation_id: chatId,
          user_id: user.user_id,
        });
      }, 1000);
    },
    [isConnected, chatId, user?.user_id, emit]
  );

  // Retry failed messages
  const retryFailedMessages = useCallback(() => {
    const failedMessages = messages.filter((msg) => msg.status === "error");
    failedMessages.forEach((msg) => {
      handleSendMessage(null, msg.content, msg.message_id);
    });
  }, [messages]);

  // Send message with retry mechanism
  const handleSendMessage = useCallback(
    async (e, retryContent = null, retryId = null) => {
      if (e) e.preventDefault();

      const messageContent = retryContent || newMessage.trim();
      if (!messageContent || !chatId || !user?.user_id) return;

      const tempMessage = {
        message_id: retryId || `temp-${Date.now()}`,
        sender: user.user_id,
        content: messageContent,
        timestamp: new Date().toISOString(),
        status: "sending",
      };

      // Optimistically update UI
      if (!retryContent) {
        setMessages((prev) => [...prev, tempMessage]);
        setNewMessage("");
      } else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.message_id === retryId
              ? { ...msg, status: "sending", error: null }
              : msg
          )
        );
      }

      try {
        // Send message with acknowledgement and timeout
        const sendMessageWithTimeout = () => {
          return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error("Message sending timeout"));
            }, 10000); // 10 second timeout

            socket.emit(
              "send_message",
              {
                conversation_id: chatId,
                message: messageContent,
                user_id: user.user_id,
              },
              (acknowledgement) => {
                clearTimeout(timeout);
                resolve(acknowledgement);
              }
            );
          });
        };

        const acknowledgement = await sendMessageWithTimeout();

        console.log("✅ Server acknowledgement:", acknowledgement);

        if (acknowledgement.status === "delivered") {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.message_id === tempMessage.message_id
                ? {
                    ...msg,
                    message_id: acknowledgement.message_id,
                    status: "delivered",
                    timestamp: acknowledgement.timestamp || msg.timestamp,
                  }
                : msg
            )
          );

          // Clear any retry timeout for this message
          if (messageRetryRefs.current[tempMessage.message_id]) {
            clearTimeout(messageRetryRefs.current[tempMessage.message_id]);
            delete messageRetryRefs.current[tempMessage.message_id];
          }
        }
      } catch (error) {
        console.error("Error sending message:", error);

        // Update message status to error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.message_id === tempMessage.message_id
              ? {
                  ...msg,
                  status: "error",
                  error: error.message,
                }
              : msg
          )
        );

        // Schedule retry for failed messages (only if not already retrying)
        if (!messageRetryRefs.current[tempMessage.message_id]) {
          messageRetryRefs.current[tempMessage.message_id] = setTimeout(() => {
            if (isConnected) {
              handleSendMessage(null, messageContent, tempMessage.message_id);
            }
          }, 3000); // Retry after 3 seconds
        }
      }
    },
    [newMessage, chatId, user?.user_id, isConnected]
  );
  useMemo(()=>{
    socket.emit("all_messages_read", {
      conversation_id: chatId,
      user_id: user.user_id,
    });
  },[chatId, messages])
  // Fetch messages with proper error handling
  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) return;

      setIsLoading(true);
      try {
        const { data } = await api.get(
          `/conversation/fetch-conversation-messages/${chatId}`
        );
        setConversationData(data?.conversation);
        setMessages(data?.conversation?.messages);
        setMembers(data?.conversation?.participants || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [chatId]);

  // Auto-scroll to bottom
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    };

    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, typingUsers]);

  // Format message time
  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get message status icon
  const getMessageStatusIcon = (status) => {
    switch (status) {
      case "sending":
        return <Loader2 className="w-3 h-3 animate-spin" />;
      case "sent":
        return <Check className="w-3 h-3" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-green-200" />;
      case "error":
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };
  const typingUsersList = useMemo(() => {
    return members
      .filter((member) => typingUsers.includes(member.user_id))
      .map((member) => member.full_name);
  }, [members, typingUsers]);

  // Memoized message list for better performance
  const messageList = useMemo(() => {
    return messages.map((message) => (
      <div
        key={message.message_id}
        className={`flex ${
          message.sender === user?.user_id ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl relative ${
            message.sender === user?.user_id
              ? "bg-indigo-600 text-white rounded-br-none"
              : "bg-gray-100 text-gray-900 rounded-bl-none"
          } ${message.status === "sending" ? "opacity-70" : ""} ${
            message.status === "error" ? "bg-red-100 border border-red-300" : ""
          }`}
        >
          <p className="text-sm break-words">{message.content}</p>
          <div className="flex items-center justify-end mt-1 space-x-1">
            <span
              className={`text-xs ${
                message.sender === user?.user_id
                  ? "text-indigo-200"
                  : "text-gray-500"
              } ${message.status === "error" ? "text-red-500" : ""}`}
            >
              {formatMessageTime(message.timestamp)}
            </span>
            {message.sender === user?.user_id && (
              <div className="flex items-center space-x-1">
                {/* {getMessageStatusIcon(message.status)} */}
                {message.status === "error" && (
                  <button
                    onClick={() =>
                      handleSendMessage(
                        null,
                        message.content,
                        message.message_id
                      )
                    }
                    className="ml-1 text-xs underline hover:no-underline flex items-center"
                    title="Retry sending"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    ));
  }, [messages, user?.user_id, handleSendMessage]);

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
      <div
        className={`px-4 py-2 text-sm text-center ${
          isConnected
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        <div className="flex items-center justify-center space-x-2">
          {isConnected ? (
            <Wifi className="w-4 h-4" />
          ) : (
            <WifiOff className="w-4 h-4" />
          )}
          <span>{isConnected ? `Connected` : "Disconnected"}</span>
          {!isConnected && (
            <button
              onClick={() => socket.connect()}
              className="ml-2 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
            >
              Reconnect
            </button>
          )}
        </div>
      </div>

      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
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
            <h3 className="font-semibold text-gray-900">
              {conversationData?.group_name || "Sarah Chen"}
            </h3>
            <div className="flex items-center space-x-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-gray-400"
                }`}
              ></div>
              <span
                className={`text-sm ${
                  isConnected ? "text-green-600" : "text-gray-500"
                }`}
              >
                {isConnected ? "Online" : "Offline"}
                {typingUsers.length > 0 && `• Typing...`}
              </span>
            </div>
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
            messageList
          ) : (
            <div className="flex flex-1 justify-center items-center text-gray-400">
              <p>No messages yet. Start a conversation!</p>
            </div>
          )}

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="flex justify-start">
              <div className="px-4 py-3 bg-gray-100 text-gray-900 rounded-2xl rounded-bl-none ">
                <div className="flex items-center gap-3">
                  {/* Enhanced typing animation */}
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"
                      style={{ animationDelay: "0.15s" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"
                      style={{ animationDelay: "0.3s" }}
                    ></div>
                  </div>

                  {/* Enhanced text with better formatting */}
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-medium text-gray-400 truncate">
                      {typingUsers.length > 0 ? (
                        <span className="flex items-center gap-1">
                          <span className="truncate">
                            {typingUsersList.join(", ")}
                          </span>
                          <span className="whitespace-nowrap">
                            {typingUsers.length === 1
                              ? "is typing"
                              : "are typing"}
                            <span className="inline-block ml-1">
                              <span className="animate-typing-dots">.</span>
                              <span
                                className="animate-typing-dots"
                                style={{ animationDelay: "0.2s" }}
                              >
                                .
                              </span>
                              <span
                                className="animate-typing-dots"
                                style={{ animationDelay: "0.4s" }}
                              >
                                .
                              </span>
                            </span>
                          </span>
                        </span>
                      ) : (
                        <span className="text-gray-500">
                          Someone is typing...
                        </span>
                      )}
                    </p>

                    {/* Optional: Show typing preview if only one user */}
                    {typingUsers.length === 1 &&
                      typingUsers[0]?.lastMessage && (
                        <p className="text-xs text-gray-500 truncate mt-1">
                          "{typingUsers[0].lastMessage.substring(0, 30)}..."
                        </p>
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-3"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => handleTyping(e.target.value)}
            placeholder={isConnected ? "Type a message..." : "Connecting..."}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !isConnected}
            className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isConnected ? (
              <Send className="w-5 h-5" />
            ) : (
              <Loader2 className="w-5 h-5 animate-spin" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
