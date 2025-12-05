import { pool } from "../config/db.config.js";

export const logUserActivity = async (user_id, action, description) => {
  try {
    const query = `
      INSERT INTO analytics.user_activity (user_id, activity_type, description)
      VALUES ($1, $2, $3)
    `;

    await pool.query(query, [user_id, action, description]);

    // Optional: return success for debugging
    return { success: true };
  } catch (error) {
    console.error("❌ Error logging user activity:", error.message);
    return { success: false, error: error.message };
  }
};
export const getUserLog = async (req, res) => {
  const user = req.user; // comes from auth middleware
  try {
    const limit = Number(req.query.limit) || 20;      // default limit
    const offset = Number(req.query.offset) || 0;     // default offset

    const query = `
      SELECT *
      FROM analytics.user_activity
      WHERE user_id = $1
      ORDER BY timestamp DESC
      LIMIT $2 OFFSET $3
    `;

    const { rows } = await pool.query(query, [
      user.user_id,
      limit,
      offset,
    ]);

    res.status(200).json({
      success: true,
      count: rows.length,
      logs: rows,
    });
  } catch (error) {
    console.error("❌ Error fetching user log:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch activity log",
      error: error.message,
    });
  }
};
export const getActivityLog = async (req, res) => {
  const limit = Number(req.query.limit) || 30;      // default limit
  const offset = Number(req.query.offset) || 0;     // default offset
  try {
    const query = `
      SELECT ua.*,
      u.full_name AS user
      FROM analytics.user_activity ua
      LEFT JOIN core.users u
        ON u.user_id = ua.user_id
      ORDER BY timestamp DESC
      LIMIT $1 OFFSET $2
    `
    const result = await pool.query(query, [limit, offset])
    return res.status(200).json({
      success: true,
      message: "Log fetched",
      logs: result.rows
    })
  } catch (error) {
    console.log("Error trying to fetch logs: ", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}
export const getActivityLogByUserId = async (req, res) => {
  const { user_id } = req.params;


  // Pagination (optional)
  const limit = Number(req.query.limit) || 20;
  const offset = Number(req.query.offset) || 0;

  try {
    // Validate user_id
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Query logs for the specific user
    const query = `
      SELECT ua.*,
             u.full_name AS user
      FROM analytics.user_activity ua
      LEFT JOIN core.users u
        ON u.user_id = ua.user_id
      WHERE ua.user_id = $1
      ORDER BY ua.timestamp DESC
      LIMIT $2 OFFSET $3
    `;

    const { rows } = await pool.query(query, [user_id, limit, offset]);

    return res.status(200).json({
      success: true,
      user_id,
      count: rows.length,
      logs: rows,
    });
  } catch (error) {
    console.error("❌ Error fetching activity log by user ID:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const recentActivity = async (req, res) => {
  try {
    const query = `
      SELECT ua.*,
             u.full_name AS user
      FROM analytics.user_activity ua
      LEFT JOIN core.users u
        ON u.user_id = ua.user_id
      ORDER BY ua.timestamp DESC
      LIMIT 5
    `;

    const { rows } = await pool.query(query);

    return res.status(200).json({
      success: true,
      message: "Top 10 recent activity fetched",
      logs: rows,
    });
  } catch (error) {
    console.error("❌ Error fetching recent activity:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

