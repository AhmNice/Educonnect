import { pool } from "../config/db.config.js";

export class StudyGroup {
  constructor({
    group_name,
    course_id,
    created_by,
    description,
    max_members = 0,
    current_members = 1,
    meeting_schedule = null,
    status = "active",
    visibility = "public",
    tags = [],
  }) {
    this.group_name = group_name;
    this.course_id = course_id;
    this.created_by = created_by;
    this.description = description;
    this.max_members = max_members;
    this.current_members = current_members;
    this.meeting_schedule = meeting_schedule;
    this.status = status;
    this.visibility = visibility;
    this.tags = tags;
  }

  // ✅ Create Study Group
  async save() {
    try {
      const query = `
        INSERT INTO learning.study_groups
        (group_name, created_by, description, course_id, max_members, current_members,
         meeting_schedule, status, visibility, tags)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *;
      `;

      const values = [
        this.group_name,
        this.created_by,
        this.description,
        this.course_id,
        this.max_members,
        this.current_members,
        this.meeting_schedule,
        this.status,
        this.visibility,
        this.tags,
      ];

      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error("❌ Error creating study group:", error.message);
      throw error;
    }
  }
  static async joinGroup({ group_id, user_id }) {
    try {
      const { rows } = await pool.query(`SELECT * FROM learning.study_groups WHERE group_id=$1`, [group_id]);
      const { rows: isMember } = await pool.query(`SELECT * FROM learning.study_group_members WHERE group_id=$1 AND user_id=$2`, [group_id, user_id]);
      if (isMember) {
        return {
          success: false,
          reason: "You are already a member of the group"
        }
      }
      if (rows[0].visibility !== `public`) {
        throw new Error("Cannot join a private group directly");
      }

      await pool.query(`INSERT INTO learning.study_group_members (group_id, user_id) VALUES ($1, $2)`, [group_id, user_id]);
      await pool.query(`UPDATE learning.study_groups SET current_members = current_members + 1 WHERE group_id = $1`, [group_id]);
      await pool.query(`INSERT INTO communication.conversation_participants (conversation_id, user_id, joined_at)
        SELECT c.conversation_id, $1, CURRENT_TIMESTAMP
        FROM communication.conversations c
        WHERE c.group_id = $2`, [user_id, group_id]);
      return {
        success: true,
        message: "Joined group successfully"
      }
    } catch (error) {
      console.error("❌ Error joining study group:", error.message);
      throw error
    }
  }
  static async joinGroupByInvite({ group_id, user_id, token }) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. Check if already a member
      const { rows: memberRows } = await client.query(
        `SELECT * FROM learning.study_group_members WHERE group_id=$1 AND user_id=$2`,
        [group_id, user_id]
      );

      if (memberRows.length > 0) {
        return {
          success: false,
          reason: "User is already a member of the group",
        };
      }

      // 2. Validate invitation
      const { rows: inviteRows } = await client.query(
        `SELECT * FROM learning.study_group_invitations
       WHERE group_id=$1 AND token=$2 AND status='pending'`,
        [group_id, token]
      );

      if (inviteRows.length === 0) {
        return {
          success: false,
          reason: "Invalid or expired invitation link",
        };
      }

      // 3. Check expiration
      const now = new Date();
      const expiryDate = new Date(inviteRows[0].expires_at);

      if (now > expiryDate) {
        return {
          success: false,
          reason: "Invitation link has expired",
        };
      }

      // 4. User exists?
      const { rows: userRows } = await client.query(
        `SELECT * FROM core.users WHERE user_id=$1`,
        [user_id]
      );

      if (userRows.length === 0) {
        return {
          success: false,
          reason: "User does not exist",
        };
      }

      // 5. Add user as member
      await client.query(
        `INSERT INTO learning.study_group_members (group_id, user_id)
       VALUES ($1, $2)`,
        [group_id, user_id]
      );

      // 6. Increment member count
      await client.query(
        `UPDATE learning.study_groups
       SET current_members = current_members + 1
       WHERE group_id = $1`,
        [group_id]
      );

      // 7. Add user to group conversation
      await client.query(
        `INSERT INTO communication.conversation_participants (conversation_id, user_id, joined_at)
       SELECT conversation_id, $1, CURRENT_TIMESTAMP
       FROM communication.conversations
       WHERE group_id = $2`,
        [user_id, group_id]
      );

      // 8. Mark invitation as accepted
      await client.query(
        `UPDATE learning.study_group_invitations
       SET status='accepted', invited_user_id=$1, invited_email=$2
       WHERE invitation_id=$3`,
        [user_id, userRows[0].email, inviteRows[0].invitation_id]
      );

      await client.query("COMMIT");

      return {
        success: true,
        message: "Joined group successfully via invitation",
      };

    } catch (error) {
      await client.query("ROLLBACK");
      console.error("❌ Error joining study group via invite:", error.message);
      throw error;

    } finally {
      client.release();
    }
  }

  // ✅ Fetch All Study Groups
  static async getAllPublic() {
    try {
      const query = `
        SELECT
    sg.group_id,
    sg.group_name,
    c.course_title AS course,
    sg.description,
    COUNT(sgm.user_id) AS member_count,
    json_agg(
      sgm.user_id
    ) AS members,
    sg.max_members,
    sg.meeting_schedule,
    sg.status,
    sg.visibility,
    sg.tags,
    sg.created_at,

    -- Creator details
   json_build_object(
          'full_name', u.full_name,
          'user_id', sg.created_by
        ) AS creator


FROM learning.study_groups sg

-- Course
LEFT JOIN learning.courses c
    ON sg.course_id = c.course_id

-- Creator
LEFT JOIN core.users u
    ON sg.created_by = u.user_id

LEFT JOIN core.universities uni
    ON u.university_id = uni.university_id

-- Group Members
LEFT JOIN learning.study_group_members sgm
    ON sg.group_id = sgm.group_id

GROUP BY
    sg.group_id,
    c.course_title,
    u.full_name,
    uni.name

ORDER BY sg.created_at DESC;

      `;

      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error("❌ Error fetching study groups:", error.message);
      throw error;
    }
  }
  // ✅ Get One Study Group
  static async getUserGroups(user_id) {
    try {
      const query = `
      SELECT
        sg.group_id,
        sg.group_name,
        c.course_title AS course,
        sg.description,
        sg.current_members,
        sg.max_members,
        sg.meeting_schedule,
        sg.status,
        sg.visibility,
        sg.tags,
        sg.created_at,

        -- Creator info
        json_build_object(
          'full_name', u.full_name,
          'user_id', sg.created_by,
          'university', uni.name
        ) AS creator,

        COUNT(sgm.user_id) AS member_count

      FROM learning.study_groups sg

      LEFT JOIN learning.courses c ON sg.course_id = c.course_id
      LEFT JOIN core.users u ON sg.created_by = u.user_id
      LEFT JOIN core.universities uni ON u.university_id = uni.university_id
      LEFT JOIN learning.study_group_members sgm ON sg.group_id = sgm.group_id

      WHERE sg.created_by = $1
      GROUP BY sg.group_id, c.course_title, u.full_name, uni.name
      ORDER BY sg.created_at DESC;
    `;

      const { rows } = await pool.query(query, [user_id]);
      return rows;
    } catch (error) {
      console.error("❌ Error fetching user groups:", error.message);
      throw error;
    }
  }
  // ✅ Update Study Group
  static async update(group_id, data) {
    try {
      const {
        group_name,
        description,
        status,
        course_id,
        max_members,
        current_members,
        meeting_schedule,
        visibility,
        tags,
      } = data;

      const query = `
        UPDATE learning.study_groups
        SET
          group_name = COALESCE($1, group_name),
          description = COALESCE($2, description),
          status = COALESCE($3, status),
          course_id = COALESCE($4, course_id),
          max_members = COALESCE($5, max_members),
          current_members = COALESCE($6, current_members),
          meeting_schedule = COALESCE($7, meeting_schedule),
          visibility = COALESCE($8, visibility),
          tags = COALESCE($9, tags),
          updated_at = CURRENT_TIMESTAMP
        WHERE group_id = $10
        RETURNING *;
      `;

      const values = [
        group_name,
        description,
        status,
        course_id,
        max_members,
        current_members,
        meeting_schedule,
        visibility,
        tags,
        group_id,
      ];

      const { rows } = await pool.query(query, values);
      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error updating study group:", error.message);
      throw error;
    }
  }
  static async getGroupById(group_id) {
    try {
      const query = `
        SELECT
          sg.group_id,
          sg.group_name,
          c.course_title AS course,
          sg.description,
          sg.current_members,
          sg.max_members,
          sg.meeting_schedule,
          sg.status,
          sg.visibility,
          sg.tags,
          sg.created_at,

          -- Creator info
          json_build_object(
            'user_id', u.user_id,
            'full_name', u.full_name,
            'university', uni.name
          ) AS creator,

          -- Count members
          COUNT(gm.user_id) AS member_count,

          -- Members array
          json_agg(
            json_build_object(
              'user_id', m.user_id,
              'full_name', m.full_name,
              'university', mu.name,
              'role', gm.role,
              'joined_at', gm.joined_at
            )
          ) AS members

        FROM learning.study_groups sg

        LEFT JOIN learning.courses c
          ON sg.course_id = c.course_id

        LEFT JOIN core.users u
          ON sg.created_by = u.user_id

        LEFT JOIN core.universities uni
          ON u.university_id = uni.university_id

        -- group members
        LEFT JOIN learning.study_group_members gm
          ON sg.group_id = gm.group_id

        LEFT JOIN core.users m
          ON gm.user_id = m.user_id

        LEFT JOIN core.universities mu
          ON m.university_id = mu.university_id

        WHERE sg.group_id = $1

        GROUP BY
          sg.group_id,
          c.course_title,
          u.user_id,
          u.full_name,
          uni.name

        ORDER BY sg.created_at DESC
      `;


      const { rows } = await pool.query(query, [group_id]);
      return rows[0];
    } catch (error) {
      console.error("❌ Error fetching user groups:", error.message);
      throw error;
    }
  }
  // ✅ Delete Study Group
  static async delete(group_id) {
    try {
      const { rowCount } = await pool.query(
        `DELETE FROM learning.study_groups WHERE group_id = $1`,
        [group_id]
      );

      return rowCount > 0;
    } catch (error) {
      console.error("❌ Error deleting study group:", error.message);
      throw error;
    }
  }

  // ✅ Toggle Status (Activate / Deactivate / Archive)
  static async toggleStatus(group_id, newStatus) {
    try {
      const query = `
        UPDATE learning.study_groups
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE group_id = $2
        RETURNING *;
      `;

      const { rows } = await pool.query(query, [newStatus, group_id]);
      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error toggling study group status:", error.message);
      throw error;
    }
  }
}
