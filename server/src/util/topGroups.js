import { pool } from "../config/db.config.js";
import { User } from "../model/User.js";

export const suggestGroups = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }
  const userRecord = User.findUserById(user.user_id);
  if (!userRecord) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }
  try {
    const query = `
    SELECT sg.*
  FROM learning.study_groups sg
  JOIN core.users creator
    ON creator.user_id = sg.created_by
  WHERE creator.university_id = (
    SELECT university_id
    FROM core.users
    WHERE user_id = $1
  )
  ORDER BY sg.current_members DESC
  LIMIT 5;
  `
    const results = await pool.query(query, [user.user_id]);
    if (results.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No groups found"
      });
    }
    return res.status(200).json({
      success: true,
      groups: results.rows
    });
  } catch (error) {
    console.error("Error fetching suggested groups:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}