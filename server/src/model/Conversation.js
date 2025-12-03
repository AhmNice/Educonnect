import { pool } from "../config/db.config.js";

export class Conversation {
  constructor({ conversation_type, group_id, created_by }) {
    this.conversation_type = conversation_type; // "private" or "group"
    this.group_id = group_id; // optional, only for group conversations
    this.created_by = created_by;
  }

  // ================================
  // Create a new conversation
  // ================================
  async save() {
    try {
      const query = `
        INSERT INTO communication.conversations (conversation_type, group_id, created_by)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      const values = [this.conversation_type, this.group_id, this.created_by];
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error("❌ Error creating conversation:", error.message);
      throw error;
    }
  }

  // ================================
  // Get all conversations
  // ================================
  static async getAll() {
    try {
      const query = `
      SELECT
        c.*,
        sg.group_name,
        lm.message_text AS last_message,
        lm.sent_at AS last_message_time,
        lm.sender_id AS last_message_sender
      FROM communication.conversations c
      LEFT JOIN learning.study_groups sg
        ON c.group_id = sg.group_id
      LEFT JOIN (
        SELECT DISTINCT ON (m.conversation_id)
          m.conversation_id,
          m.message_text,
          m.sent_at,
          m.sender_id
        FROM communication.messages m
        ORDER BY m.conversation_id, m.sent_at DESC
      ) lm
        ON lm.conversation_id = c.conversation_id
      ORDER BY c.created_at DESC;
    `;
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error("❌ Error fetching conversations:", error.message);
      throw error;
    }
  }
  // ===============================
  // get user conversation list
  // ===============================
  static async getUserConversations(user_id) {
    try {
      const query = `
              SELECT
          c.*,
          sg.group_name,
          lm.message_text AS last_message,
          lm.sent_at AS last_message_time,
          lm.sender_id AS last_message_sender,
          COALESCE(unread.count, 0) AS unread_count,
          members.members AS conversation_members
        FROM communication.conversation_participants cp
        JOIN communication.conversations c
          ON cp.conversation_id = c.conversation_id
        LEFT JOIN learning.study_groups sg
          ON c.group_id = sg.group_id

        -- LAST MESSAGE
        LEFT JOIN (
          SELECT DISTINCT ON (m.conversation_id)
            m.conversation_id,
            m.message_text,
            m.sent_at,
            m.sender_id
          FROM communication.messages m
          ORDER BY m.conversation_id, m.sent_at DESC
        ) lm
          ON lm.conversation_id = c.conversation_id

        -- UNREAD MESSAGES
        LEFT JOIN (
          SELECT
            m.conversation_id,
            COUNT(*) AS count
          FROM communication.messages m
          JOIN communication.conversation_participants cp_user
            ON cp_user.conversation_id = m.conversation_id
          WHERE cp_user.user_id = $1
            AND m.sender_id != $1
            AND m.sent_at > COALESCE(cp_user.last_read_at, '1970-01-01')
          GROUP BY m.conversation_id
        ) unread
          ON unread.conversation_id = c.conversation_id

        -- MEMBERS (user_id, full_name)
        LEFT JOIN (
          SELECT
            cp.conversation_id,
            json_agg(
              json_build_object(
                'user_id', u.user_id,
                'full_name', u.full_name
              )
            ) AS members
          FROM communication.conversation_participants cp
          JOIN core.users u
            ON u.user_id = cp.user_id
          GROUP BY cp.conversation_id
        ) members
          ON members.conversation_id = c.conversation_id

        WHERE cp.user_id = $1
        ORDER BY c.created_at DESC;

    `;
      const { rows } = await pool.query(query, [user_id]);
      return rows;
    } catch (error) {
      console.error("❌ Error fetching user conversations:", error.message);
      throw error;
    }
  }


  // ================================
  // Get conversation by ID
  // ================================
  static async getById(conversation_id) {
    try {
      const query = `
        SELECT c.*, sg.group_name
        FROM communication.conversations c
        LEFT JOIN learning.study_groups sg ON c.group_id = sg.group_id
        WHERE c.conversation_id = $1;
      `;
      const { rows } = await pool.query(query, [conversation_id]);
      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error fetching conversation by ID:", error.message);
      throw error;
    }
  }

  static async getByGroupId(group_id) {
    try {
      const query = `
      SELECT c.*, sg.group_name
      FROM communication.conversations c
      LEFT JOIN learning.study_groups sg ON sg.group_id = c.group_id
      WHERE c.group_id = $1;
    `;
      const { rows } = await pool.query(query, [group_id]);
      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error fetching conversation by ID:", error.message);
      throw error;
    }
  }

  // ============================================
  //get full conversation data (only type or group_id)
  // ============================================
  static async getFullConversation(conversation_id) {
    try {
          const query = `
            SELECT
              c.*,
              sg.group_name,

              -- messages aggregated separately
              (
                SELECT COALESCE(
                  json_agg(
                    json_build_object(
                      'message_id', m.message_id,
                      'sender', m.sender_id,
                      'content', m.message_text,
                      'timestamp', m.sent_at,
                      'status', m.status,
                      'updated_at', m.updated_at
                    ) ORDER BY m.sent_at
                  ),
                  '[]'::json
                )
                FROM communication.messages m
                WHERE m.conversation_id = c.conversation_id
              ) AS messages,

              -- participants aggregated separately
              (
                SELECT COALESCE(
                  json_agg(
                    json_build_object(
                      'user_id', cp.user_id,
                      'full_name', u.full_name,
                      'last_read_at', cp.last_read_at
                    ) ORDER BY u.full_name
                  ),
                  '[]'::json
                )
                FROM communication.conversation_participants cp
                LEFT JOIN core.users u ON u.user_id = cp.user_id
                WHERE cp.conversation_id = c.conversation_id
              ) AS participants

            FROM communication.conversations c
            LEFT JOIN learning.study_groups sg
              ON sg.group_id = c.group_id

            WHERE c.conversation_id = $1;
    `;
      const { rows } = await pool.query(query, [conversation_id]);
      return rows[0] || null;

    } catch (error) {
      console.error("Error fetching conversation:", error.message);
      throw error;
    }
  }


  // ============================================
  // Update conversation (only type or group_id)
  // ============================================
  static async update(conversation_id, data) {
    try {
      const { conversation_type, group_id } = data;
      const query = `
        UPDATE communication.conversations
        SET
          conversation_type = COALESCE($1, conversation_type),
          group_id = COALESCE($2, group_id)
        WHERE conversation_id = $3
        RETURNING *;
      `;
      const { rows } = await pool.query(query, [conversation_type, group_id, conversation_id]);
      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error updating conversation:", error.message);
      throw error;
    }
  }

  // ================================
  // Delete conversation
  // ================================
  static async delete(group_id) {
    try {
      const { rowCount } = await pool.query(
        "DELETE FROM communication.conversations WHERE group_id = $1",
        [group_id]
      );
      return rowCount > 0;
    } catch (error) {
      console.error("❌ Error deleting conversation:", error.message);
      throw error;
    }
  }
}
