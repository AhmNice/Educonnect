import { pool } from "../config/db.config.js";

export class ConversationParticipant {
  constructor({ participant_id, conversation_id, user_id, joined_at, last_read_at } = {}) {
    this.participant_id = participant_id;
    this.conversation_id = conversation_id;
    this.user_id = user_id;
    this.joined_at = joined_at;
    this.last_read_at = last_read_at;
  }



  async save(client = pool) {
    const query = `
      INSERT INTO communication.conversation_participants
      (conversation_id, user_id, joined_at)
      VALUES ($1, $2, COALESCE($3, CURRENT_TIMESTAMP))
      ON CONFLICT (conversation_id, user_id) DO NOTHING
      RETURNING *;
    `;

    const values = [
      this.conversation_id,
      this.user_id,
      this.joined_at
    ];

    const result = await client.query(query, values);

    // If user is already added → return existing record is null
    if (result.rows.length === 0) {
      return null;
    }

    // update this instance with DB row
    Object.assign(this, result.rows[0]);
    return this;
  }

  // ---------------------------
  // STATIC HELPERS STILL WORK
  // ---------------------------
  static async removeParticipant(conversation_id, user_id) {
    const query = `
      DELETE FROM communication.conversation_participants
      WHERE conversation_id = $1 AND user_id = $2
      RETURNING *;
    `;

    const res = await pool.query(query, [conversation_id, user_id]);
    return res.rows[0];
  }

  static async isParticipant(conversation_id, user_id) {
    const query = `
      SELECT 1 FROM communication.conversation_participants
      WHERE conversation_id = $1 AND user_id = $2
      LIMIT 1;
    `;

    const res = await pool.query(query, [conversation_id, user_id]);
    return res.rowCount > 0;
  }

  static async getParticipants(conversation_id) {
    const query = `
      SELECT
        cp.participant_id,
        cp.conversation_id,
        cp.user_id,
        u.full_name,
        u.email,
        cp.joined_at
      FROM communication.conversation_participants cp
      JOIN core.users u ON u.user_id = cp.user_id
      WHERE cp.conversation_id = $1
      ORDER BY cp.joined_at ASC;
    `;

    const res = await pool.query(query, [conversation_id]);
    return res.rows;
  }

  static async getUserConversations(user_id) {
    const query = `
      SELECT
        c.conversation_id,
        c.conversation_type,
        c.group_id,
        c.created_at
      FROM communication.conversation_participants cp
      JOIN communication.conversations c
        ON c.conversation_id = cp.conversation_id
      WHERE cp.user_id = $1
      ORDER BY c.created_at DESC;
    `;

    const res = await pool.query(query, [user_id]);
    return res.rows;
  }
  static async delete(conversation_id) {
    try {
      const { rowCount } = await pool.query(`
        DELETE FROM communication.conversation_participants
        WHERE conversation_id = $1`,
        [conversation_id]
      )
      return rowCount > 0
    } catch (error) {
      console.log("Error trying to delete conversation participants");
      throw error
    }
  }
}
