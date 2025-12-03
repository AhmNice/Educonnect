export class Notification {
  constructor({ user_id, title, body, is_read = false }) {
    this.user_id = user_id;
    this.title = title;
    this.body = body;
    this.is_read = is_read;
  }

  // =============
  // Create notification
  // =============
  async save() {
    try {
      const query = `
        INSERT INTO communication.notifications (user_id, title, body, is_read)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const values = [this.user_id, this.title, this.body, this.is_read];
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error("❌ Error saving notification:", error.message);
      throw error;
    }
  }

  // =============
  // Mark notification as read
  // =============
  static async markAsRead(notification_id) {
    try {
      const query = `
        UPDATE communication.notifications
        SET is_read = true
        WHERE notification_id = $1
        RETURNING *;
      `;
      const { rows } = await pool.query(query, [notification_id]);
      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error updating notification:", error.message);
      throw error;
    }
  }

  // =============
  // Delete notification
  // =============
  static async delete(notification_id) {
    try {
      const { rowCount } = await pool.query(
        "DELETE FROM communication.notifications WHERE notification_id = $1",
        [notification_id]
      );
      return rowCount > 0;
    } catch (error) {
      console.error("❌ Error deleting notification:", error.message);
      throw error;
    }
  }
}