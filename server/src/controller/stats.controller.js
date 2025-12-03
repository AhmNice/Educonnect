import { pool } from "../config/db.config.js";

export const platformMetrics = async (req, res) => {
  const client = await pool.connect();
  try {
    client.query('BEGIN');
    const totalUsersResult = await client.query(`
      SELECT COUNT(*) AS total_users FROM core.users;
    `);
    const totalConversationsResult = await client.query(`
      SELECT COUNT(*) AS total_conversations FROM communication.conversations;
    `);
    const todayTotalMessagesResult = await client.query(`
      SELECT COUNT(*) AS total_messages FROM communication.messages WHERE sent_at >= CURRENT_DATE;
    `);
    const totalActiveUsersResult = await client.query(`
      SELECT COUNT(*) AS total_active_users FROM core.users WHERE status >= 'active';
    `);
    const studyGroupResult = await client.query(`
      SELECT COUNT(*) AS total_study_groups FROM learning.study_groups;
    `);
    const courseResult = await client.query(`
      SELECT COUNT(*) AS total_courses FROM learning.courses;
    `);
    const newUsersLast7DaysResult = await client.query(`
      SELECT COUNT(*) AS new_users_last_7_days FROM core.users WHERE created_at >= CURRENT_DATE - INTERVAL '7 days';
    `);
    //  user distributions
    // const
    client.query('COMMIT');
    const metrics = {
      total_users: parseInt(totalUsersResult.rows[0].total_users, 10),
      total_conversations: parseInt(totalConversationsResult.rows[0].total_conversations, 10),
      total_messages_today: parseInt(todayTotalMessagesResult.rows[0].total_messages, 10),
      total_active_users: parseInt(totalActiveUsersResult.rows[0].total_active_users, 10),
      total_study_groups: parseInt(studyGroupResult.rows[0].total_study_groups, 10),
      total_courses: parseInt(courseResult.rows[0].total_courses, 10),
      new_users_last_7_days: parseInt(newUsersLast7DaysResult.rows[0].new_users_last_7_days, 10)
    }
    return res.status(200).json({
      success: true,
      metrics
    })
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("❌ Error fetching platform metrics:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching platform metrics"
    });
  }
}
export const userList = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
      u.user_id,
      u.full_name,
      u.email,
      u.role,
      u.status,
      u.created_at,
      uni.name AS university_name,
      uni.university_id,
      u.created_at,
      u.is_verified AS email_verified,
      u.department
      FROM core.users u
      LEFT JOIN core.universities uni ON u.university_id = uni.university_id
      ORDER BY u.created_at DESC;
    `);
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users: result.rows
    })
  } catch (error) {
    console.error("❌ Error fetching user list:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching user list"
    });
  }
}