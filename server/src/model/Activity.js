export class UserActivity {
  constructor({ user_id, activity_type, description }) {
    this.user_id = user_id;
    this.activity_type = activity_type;
    this.description = description;
  }

  async save() {
    try {
      const query = `
        INSERT INTO analytics.user_activity (user_id, activity_type, description)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      const { rows } = await pool.query(query, [this.user_id, this.activity_type, this.description]);
      return rows[0];
    } catch (error) {
      console.error("❌ Error saving user activity:", error.message);
      throw error;
    }
  }
}