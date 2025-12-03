import { pool } from "../config/db.config.js";

export class GroupMember {
  constructor({ group_id, user_id, role = "member" }) {
    this.group_id = group_id;
    this.user_id = user_id;
    this.role = role;
  }

  // ========================
  // Add a member to a group
  // ========================
  async save() {
    try {
      const query = `
        INSERT INTO learning.study_group_members (group_id, user_id, role)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      const values = [this.group_id, this.user_id, this.role];
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error("❌ Error adding group member:", error.message);
      throw error;
    }
  }

  // ==============================
  // Get all members of all groups
  // ==============================
  static async getAll() {
    try {
      const query = `
        SELECT gm.*, u.full_name, u.email, sg.group_name
        FROM learning.group_members gm
        LEFT JOIN core.users u ON gm.user_id = u.user_id
        LEFT JOIN learning.study_groups sg ON gm.group_id = sg.group_id
        ORDER BY gm.joined_at DESC;
      `;
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error("❌ Error fetching group members:", error.message);
      throw error;
    }
  }

  // =======================
  // Get members by group
  // =======================
  static async getByGroup(group_id) {
    try {
      const query = `
        SELECT gm.*, u.full_name, u.email
        FROM learning.group_members gm
        LEFT JOIN core.users u ON gm.user_id = u.user_id
        WHERE gm.group_id = $1
        ORDER BY gm.joined_at ASC;
      `;
      const { rows } = await pool.query(query, [group_id]);
      return rows;
    } catch (error) {
      console.error("❌ Error fetching members by group:", error.message);
      throw error;
    }
  }

  // ==========================
  // Update member role
  // ==========================
  static async updateRole(group_member_id, newRole) {
    try {
      const query = `
        UPDATE learning.group_members
        SET role = $1
        WHERE group_member_id = $2
        RETURNING *;
      `;
      const { rows } = await pool.query(query, [newRole, group_member_id]);
      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error updating member role:", error.message);
      throw error;
    }
  }

  // =============================
  // Remove a member from a group
  // =============================
  static async remove(group_member_id) {
    try {
      const { rowCount } = await pool.query(
        "DELETE FROM learning.group_members WHERE group_member_id = $1",
        [group_member_id]
      );
      return rowCount > 0; // true if deleted
    } catch (error) {
      console.error("❌ Error deleting group member:", error.message);
      throw error;
    }
  }
  static async delete(group_id) {
    try {
      const { rowCount } = await pool.query(
        "DELETE FROM learning.group_members WHERE group_id = $1",
        [group_id]
      );
      return rowCount > 0
    } catch (error) {
      console.log("❌ Error trying to delete group members")
      throw error
    }
  }
}

