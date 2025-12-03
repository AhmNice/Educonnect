export class Report {
  constructor({ reporter_id, reported_user_id, reason, status = "pending" }) {
    this.reporter_id = reporter_id;
    this.reported_user_id = reported_user_id;
    this.reason = reason;
    this.status = status;
  }

  async save() {
    try {
      const query = `
        INSERT INTO analytics.reports (reporter_id, reported_user_id, reason, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const { rows } = await pool.query(query, [this.reporter_id, this.reported_user_id, this.reason, this.status]);
      return rows[0];
    } catch (error) {
      console.error("❌ Error saving report:", error.message);
      throw error;
    }
  }

  static async updateStatus(report_id, newStatus) {
    try {
      const query = `
        UPDATE analytics.reports
        SET status = $1
        WHERE report_id = $2
        RETURNING *;
      `;
      const { rows } = await pool.query(query, [newStatus, report_id]);
      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error updating report status:", error.message);
      throw error;
    }
  }
}
