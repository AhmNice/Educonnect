import { pool } from "../config/db.config.js";

export class Message {
  constructor({ conversation_id, sender_id, message_text, message_type = "text" }) {
    this.conversation_id = conversation_id;
    this.sender_id = sender_id;
    this.message_text = message_text;
    this.message_type = message_type;
  }

  // =============
  // Create a message
  // =============
  async save() {
    try {
      const query = `
        INSERT INTO communication.messages (conversation_id, sender_id, message_text, message_type)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const values = [this.conversation_id, this.sender_id, this.message_text, this.message_type];
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error("❌ Error saving message:", error.message);
      throw error;
    }
  }

  // =============
  // update message
  // =============
  static async updateMessageStatus({ conversation_id, message_id, status }) {
    try {
      const query = `
        UPDATE communication.messages
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE conversation_id = $2 AND message_id = $3
        RETURNING *
      `;
      const values = [status, conversation_id, message_id];

      const result = await pool.query(query, values);

      if (result.rowCount === 0) {
        console.warn(`⚠️ Message not found: ${message_id}`);
        return null;
      }

      return result.rows[0];
    } catch (error) {
      console.error("❌ Error updating message status:", error.message);
      throw error; // rethrow so calling code can handle it
    }
  }
  // =============
  // Get messages by conversation
  // =============
  static async getByConversation(conversation_id) {
    try {
      const query = `
        SELECT m.*, u.full_name AS sender_name
        FROM communication.messages m
        LEFT JOIN core.users u ON m.sender_id = u.user_id
        WHERE m.conversation_id = $1
        ORDER BY m.sent_at ASC;
      `;
      const { rows } = await pool.query(query, [conversation_id]);
      return rows;
    } catch (error) {
      console.error("❌ Error fetching messages:", error.message);
      throw error;
    }
  }
  
  // =============
  // Delete message
  // =============
  static async delete(message_id) {
    try {
      const { rowCount } = await pool.query(
        "DELETE FROM communication.messages WHERE message_id = $1",
        [message_id]
      );
      return rowCount > 0;
    } catch (error) {
      console.error("❌ Error deleting message:", error.message);
      throw error;
    }
  }
}
