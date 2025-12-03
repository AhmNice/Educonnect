import { Server } from "socket.io";
import dotenv from "dotenv";
import { Message } from "../model/Message.js";
import { pool } from "./db.config.js";
dotenv.config();

let io;

export const initSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    },
    // Add these for better compatibility
    connectionStateRecovery: {
      // the backup duration of the sessions and the packets
      maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
      skipMiddlewares: true,
    }
  });

  console.log("✅ Socket.IO server initialized");
  console.log("🌐 CORS configured for:", process.env.CLIENT_URL);

  io.on("connection", (socket) => {

    // =====================================================
    // 🔹 USER JOIN A CONVERSATION ROOM
    // =====================================================
    socket.on("join_conversation", ({ conversation_id, user_id }) => {
      if (!conversation_id) {
        console.log("❌ No conversation_id provided");
        return;
      }

      socket.join(conversation_id);
      console.log(`👤 User ${socket.id} joined conversation ${conversation_id}`);

      // Send confirmation back to client
      socket.emit("joined_conversation", {
        conversation_id,
        success: true,
        message: `Successfully joined conversation ${conversation_id}`
      });
    });
    // =====================================================
    // 🔹 LEAVE CONVERSATION ROOM
    // =====================================================
    socket.on("leave_conversation", (conversation_id) => {
      socket.leave(conversation_id);
      // console.log(`👤 User ${socket.id} left conversation ${conversation_id}`);
    });
    // =====================================================
    // 🔹 SEND MESSAGE (with server acknowledgement)
    // =====================================================
    socket.on("send_message", async (data, callback) => {
      try {
        const { conversation_id, message, user_id } = data;
        if (!conversation_id || !message || !user_id) {
          console.log("❌ Missing required fields:", { conversation_id, message, user_id });
          if (callback) {
            callback({ status: "error", message: "Missing required fields" });
          }
          return;
        }

        // Save message in DB (example)
        const newMessage = await new Message({ conversation_id, sender_id: user_id, message_text: message }).save()
        const savedMessageId = newMessage.message_id

        // Broadcast message to other users in the room
        socket.to(conversation_id).emit("message_received", {
          conversation_id,
          message: message,
          user_id: user_id,
          message_id: savedMessageId,
          delivered_at: new Date().toISOString(),
        });
        io.to(conversation_id).emit("conversation_updated", {
          conversation_id,
          last_message: message,
          last_message_at: new Date().toISOString(),
          sender_id: user_id,
          unread_count: 1
        });

        console.log(`📤 Message broadcasted to room: ${conversation_id}`);

        // Acknowledgement back to sender
        if (callback) {
          callback({
            status: "delivered",
            message_id: savedMessageId,
            delivered_at: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error("❌ Error in send_message:", error);
        if (callback) {
          callback({ status: "error", message: error.message });
        }
      }
    });
    // =====================================================
    // 🔹 READ MESSAGE
    // =====================================================
    socket.on("all_messages_read", async (data) => {
      const { conversation_id, user_id } = data;
      if (!conversation_id || !user_id) {
        console.log("❌ Missing conversation_id or user_id in read_message");
        return;
      }
      try {
        const result = await pool.query(`
          UPDATE communication.conversation_participants
          SET last_read_at = CURRENT_TIMESTAMP
          WHERE conversation_id = $1 AND user_id = $2
          RETURNING *;
        `, [conversation_id, user_id]);
        console.log(result.rows)
      } catch (error) {
        console.error("❌ Error updating last_read_at:", error.message);
        return;
      }
      // Notify other participants in the conversation
      io.to(conversation_id).emit("message_read", { conversation_id, user_id, last_read_at: new Date().toISOString() });
    })


    // =====================================================
    // 🔹 USER START TYPING
    // =====================================================
    socket.on("user_typing", (data) => {
      const { conversation_id, user_id } = data;
      console.log("user typing")
      if (!conversation_id || !user_id) {
        console.log("❌ Missing conversation_id or user_id in user_typing");
        return;
      }

      // console.log(`⌨️ User ${user_id} typing in ${conversation_id}`);

      socket.to(conversation_id).emit("user_typing", {
        conversation_id,
        user_id,
        isTyping: true,
      });
    });

    // =====================================================
    // 🔹 USER STOP TYPING
    // =====================================================
    socket.on("user_stop_typing", (data) => {
      const { conversation_id, user_id } = data;

      if (!conversation_id || !user_id) {
        console.log("❌ Missing conversation_id or user_id in user_stop_typing");
        return;
      }

      // console.log(`💤 User ${user_id} stopped typing in ${conversation_id}`);

      socket.to(conversation_id).emit("user_stop_typing", {
        conversation_id,
        user_id,
      });
    });

    // =====================================================
    // 🔹 TEST EVENT (for debugging)
    // =====================================================
    socket.on("ping", (data, callback) => {
      console.log("🏓 Ping received:", data);
      if (callback) {
        callback({ status: "pong", timestamp: new Date().toISOString() });
      }
    });

    // =====================================================
    // 🔹 DISCONNECT
    // =====================================================
    socket.on("disconnect", (reason) => {
      console.log(`❌ User disconnected: ${socket.id}`, reason);
    });

    // =====================================================
    // 🔹 ERROR HANDLING
    // =====================================================
    socket.on("error", (error) => {
      console.error(`💥 Socket error for ${socket.id}:`, error);
    });
  });

  return io;
};

// Helper function to get the io instance
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
};