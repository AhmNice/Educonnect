export const socketHandlers = (chatId, { setChats = null, socket, setIsConnected, setMessages, setTypingUsers, user }) => ({
  connect: () => {
    console.log("✅ ChatWindow: Socket connected!");
    if (setIsConnected) setIsConnected(true);

    if (chatId && socket) {
      console.log(`🎯 Joining conversation: ${chatId}`);
      socket.emit("join_conversation", {
        conversation_id: chatId, user_id: user?.user_id });
    }
  },

  disconnect: () => {
    console.log("❌ ChatWindow: Socket disconnected!");
    if (setIsConnected) setIsConnected(false);
  },

  connect_error: (error) => {
    console.error("🔥 ChatWindow: Connection error:", error);
    if (setIsConnected) setIsConnected(false);
  },

  message_received: (data) => {
    console.log("📨 Message received from server:", data);
    if (setMessages) {
      setMessages((prev) => [
        ...prev,
        {
          message_id: data.message_id,
          sender: data.user_id,
          content: data.message,
          timestamp: data.delivered_at,
        },
      ]);
    }
  },
  conversation_updated: (data) => {
    console.log("📝 Conversation updated:", data);
    if (!setChats) {
      console.log("socketHandlers: setChats not provided");
      return;
    }
    setChats((prevChats = []) => {
      if (!Array.isArray(prevChats)) prevChats = [];
      const incomingId = String(data.conversation_id ?? data.conversationId ?? data.id);
      let found = false;
      const updated = prevChats.map((chat) => {
        if (String(chat.conversation_id) === incomingId) {
          found = true;
          return {
            ...chat,
            unread_count: data.sender_id !== user?.user_id ? (chat.unread_count || 0) + 1 : chat.unread_count,
            last_message: data.last_message ?? chat.last_message,
            last_message_time: data.last_message_at ?? data.last_message_time ?? chat.last_message_time,
            last_message_sender: data.sender_id ?? data.last_message_sender ?? chat.last_message_sender,
          };
        }
        return chat;
      });
      if (!found) {
        // Optionally insert new conversation entry if not found
        updated.unshift({
          conversation_id: incomingId,
          last_message: data.last_message,
          last_message_time: data.last_message_at ?? Date.now(),
          last_message_sender: data.sender_id,
          // add other fields as needed
        });
      }
      return updated;
    });
  },

  all_messages_read: (data) => {
    console.log("✅ all_messages_read event received:", data);
    if (!setChats) {
      console.log("socketHandlers: setChats not provided");
      return;
    }

    setChats((prevChats = []) => {
      if (!Array.isArray(prevChats)) prevChats = [];

      // Accept multiple id shapes from server and chat objects
      const incomingId = String(data.conversation_id ?? data.conversationId ?? data.id ?? data.convo_id ?? "");
      console.log("socketHandlers: incoming conversation id:", incomingId);

      let matched = false;
      const updated = prevChats.map((chat) => {
        const chatId = String(chat.conversation_id ?? chat.conversationId ?? chat.id ?? "");
        if (chatId === incomingId) {
          matched = true;
          console.log("socketHandlers: marking unread_count=0 for chat", chatId);
          return { ...chat, unread_count: 0 };
        }
        return chat;
      });

      if (!matched) {
        console.warn("socketHandlers: no matching conversation found in prevChats", prevChats.map(c => c.conversation_id ?? c.conversationId ?? c.id));
      }

      return updated;
    });
  },

  user_typing: (data) => {
    console.log("⌨️ User typing:", data);
    if (user && data.user_id !== user.user_id && setTypingUsers && data.conversation_id === chatId) {
      console.log("✅ Adding user to typing list:", data.user_id);
      setTypingUsers((prev) => [
        ...prev.filter((id) => id !== data.user_id),
        data.user_id,
      ]);
    }
  },

  user_stop_typing: (data) => {
    console.log("💤 User stopped typing:", data);
    if (user && data.user_id !== user.user_id && setTypingUsers && data.conversation_id === chatId) {
      console.log("✅ Removing user from typing list:", data.user_id);
      setTypingUsers((prev) => prev.filter((id) => id !== data.user_id));
    }
  },

  message_read: (data) => {
    console.log("✅ Message read by recipient:", data);
    if (!setChats) return;
    const incomingId = String(data.conversation_id ?? data.conversationId ?? data.id ?? data.convo_id ?? "");
    setChats((prevChats = []) => {
      if (!Array.isArray(prevChats)) return prevChats;
      return prevChats.map((chat) => {
        const chatId = String(chat.conversation_id ?? chat.conversationId ?? chat.id ?? "");
        return chatId === incomingId ? { ...chat, unread_count: 0 } : chat;
      });
    });
  },
});