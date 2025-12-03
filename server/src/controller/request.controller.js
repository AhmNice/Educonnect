import { pool } from "../config/db.config.js";
import { Conversation } from "../model/Conversation.js";
import { ConversationParticipant } from "../model/Participant.js";
import { StudyGroup } from "../model/StudyGroup.js";
import { User } from "../model/User.js";

/**
 * REQUEST TO JOIN GROUP
 */
export const RequestJoinGroup = async (req, res) => {
  const { group_id, user_id, message } = req.body;

  try {
    // Validate user
    const user = await User.findUserById(user_id);
    if (!user?.user_data) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Validate group
    const group = await StudyGroup.getGroupById({ group_id });
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    // Check if already pending
    const existing = await pool.query(
      `SELECT 1 FROM learning.group_request
       WHERE user_id = $1 AND group_id = $2 AND status = 'pending'`,
      [user_id, group_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending request for this group"
      });
    }

    // Insert request
    const result = await pool.query(
      `INSERT INTO learning.group_request (user_id, group_id, status, message)
       VALUES ($1, $2, 'pending', $3)
       RETURNING *`,
      [user_id, group_id, message || null]
    );

    return res.status(201).json({
      success: true,
      message: "Join request submitted successfully",
      request: result.rows[0]
    });

  } catch (error) {
    console.error("RequestJoinGroup Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong submitting your request"
    });
  }
};

/**
 * APPROVE SINGLE REQUEST
 */
export const ApproveGroupRequest = async (req, res) => {
  const { request_id, admin_id } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const requestRes = await client.query(
      `SELECT * FROM learning.group_request WHERE request_id = $1`,
      [request_id]
    );

    if (requestRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    const request = requestRes.rows[0];

    if (request.status !== "pending") {
      await client.query("ROLLBACK");
      return res.status(400).json({ success: false, message: "Request already processed" });
    }

    // Insert into group members
    await client.query(
      `INSERT INTO learning.study_group_members (group_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [request.group_id, request.user_id]
    );

    // Increment group member count
    await client.query(
      `UPDATE learning.study_groups
       SET current_members = current_members + 1
       WHERE group_id = $1`,
      [request.group_id]
    );

    // Conversation for the group
    const conversation = await Conversation.getByGroupId(request.group_id);

    // Add to conversation participants
    await new ConversationParticipant({
      conversation_id: conversation.conversation_id,
      user_id: request.user_id,
      joined_at: new Date()
    }).save(client);

    // Mark as approved
    const updated = await client.query(
      `UPDATE learning.group_request
       SET status = 'approved',
           processed_by = $1,
           processed_at = CURRENT_TIMESTAMP
       WHERE request_id = $2
       RETURNING *`,
      [admin_id, request_id]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Request approved successfully",
      request: updated.rows[0]
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("ApproveGroupRequest Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  } finally {
    client.release();
  }
};

/**
 * DECLINE REQUEST
 */
export const DeclineGroupRequest = async (req, res) => {
  const { request_id, admin_id } = req.body;

  try {
    const requestRes = await pool.query(
      `SELECT * FROM learning.group_request WHERE request_id = $1`,
      [request_id]
    );

    if (requestRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    if (requestRes.rows[0].status !== "pending") {
      return res.status(400).json({ success: false, message: "Request already processed" });
    }

    const updated = await pool.query(
      `UPDATE learning.group_request
       SET status = 'declined',
           processed_by = $1,
           processed_at = CURRENT_TIMESTAMP
       WHERE request_id = $2
       RETURNING *`,
      [admin_id, request_id]
    );

    return res.status(200).json({
      success: true,
      message: "Request declined",
      request: updated.rows[0]
    });

  } catch (error) {
    console.error("DeclineGroupRequest Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * GET ALL REQUESTS FOR A GROUP
 */
export const GetGroupRequests = async (req, res) => {
  const { group_id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT
        gr.request_id,
        gr.user_id,
        gr.status,
        gr.message,
        gr.requested_at,
        gr.processed_at,

        json_build_object(
          'user_id', u2.user_id,
          'full_name', u2.full_name
        ) AS processed_by,

        json_build_object(
          'user_id', u.user_id,
          'full_name', u.full_name,
          'email', u.email,
          'university', uni.name
        ) AS user
      FROM learning.group_request gr
      JOIN core.users u ON gr.user_id = u.user_id
      LEFT JOIN core.users u2 ON gr.processed_by = u2.user_id
      JOIN core.universities uni ON u.university_id = uni.university_id
      WHERE gr.group_id = $1
      ORDER BY gr.requested_at DESC
      `,
      [group_id]
    );

    return res.status(200).json({
      success: true,
      requests: result.rows
    });

  } catch (error) {
    console.error("GetGroupRequests Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * GET USER'S OWN GROUP REQUESTS
 */
export const GetUserGroupRequests = async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT gr.*, sg.group_name
       FROM learning.group_request gr
       JOIN learning.study_groups sg ON gr.group_id = sg.group_id
       WHERE gr.user_id = $1
       ORDER BY gr.requested_at DESC`,
      [user_id]
    );

    return res.status(200).json({
      success: true,
      requests: result.rows
    });

  } catch (error) {
    console.error("GetUserGroupRequests Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * APPROVE ALL REQUESTS FOR A GROUP
 */
export const approveAllGroupRequest = async (req, res) => {
  const { group_id, admin_id } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Approve everyone
    const result = await client.query(
      `
      UPDATE learning.group_request
      SET status = 'approved',
          processed_by = $1,
          processed_at = CURRENT_TIMESTAMP
      WHERE group_id = $2 AND status = 'pending'
      RETURNING *
      `,
      [admin_id, group_id]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "No pending requests found for this group"
      });
    }

    // Fetch conversation
    const conversation = await Conversation.getByGroupId(group_id);

    // Loop through each approved request
    for (const reqData of result.rows) {

      // Insert into group members
      await client.query(
        `
        INSERT INTO learning.study_group_members (group_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        `,
        [group_id, reqData.user_id]
      );

      // Update group members count
      await client.query(
        `
        UPDATE learning.study_groups
        SET current_members = current_members + 1
        WHERE group_id = $1
        `,
        [group_id]
      );

      // Insert into conversation participants
      await new ConversationParticipant({
        conversation_id: conversation.conversation_id,
        user_id: reqData.user_id,
        joined_at: new Date()
      }).save(client);
    }

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "All group requests approved successfully",
      data: result.rows
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error approving group requests:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while approving group requests"
    });
  } finally {
    client.release();
  }
};
