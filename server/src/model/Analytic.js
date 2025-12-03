export class AnalyticsMetric {
  constructor({ metric_name, today_value = 0, weekly_value = 0, monthly_value = 0, growth_rate = 0 }) {
    this.metric_name = metric_name;
    this.today_value = today_value;
    this.weekly_value = weekly_value;
    this.monthly_value = monthly_value;
    this.growth_rate = growth_rate;
  }

  // =============
  // Create metric
  // =============
  async save() {
    try {
      const query = `
        INSERT INTO analytics.analytics (metric_name, today_value, weekly_value, monthly_value, growth_rate)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const values = [this.metric_name, this.today_value, this.weekly_value, this.monthly_value, this.growth_rate];
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error("❌ Error saving analytics metric:", error.message);
      throw error;
    }
  }

  // =============
  // Update metric
  // =============
  static async update(metric_id, data) {
    try {
      const { today_value, weekly_value, monthly_value, growth_rate } = data;
      const query = `
        UPDATE analytics.analytics
        SET
          today_value = COALESCE($1, today_value),
          weekly_value = COALESCE($2, weekly_value),
          monthly_value = COALESCE($3, monthly_value),
          growth_rate = COALESCE($4, growth_rate),
          last_updated = CURRENT_TIMESTAMP
        WHERE metric_id = $5
        RETURNING *;
      `;
      const { rows } = await pool.query(query, [today_value, weekly_value, monthly_value, growth_rate, metric_id]);
      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error updating analytics metric:", error.message);
      throw error;
    }
  }

  // =============
  // Delete metric
  // =============
  static async delete(metric_id) {
    try {
      const { rowCount } = await pool.query(
        "DELETE FROM analytics.analytics WHERE metric_id = $1",
        [metric_id]
      );
      return rowCount > 0;
    } catch (error) {
      console.error("❌ Error deleting analytics metric:", error.message);
      throw error;
    }
  }
}