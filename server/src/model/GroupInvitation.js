import { pool } from "../config/db.config.js";
import crypto from "crypto";
import dotenv from 'dotenv';

dotenv.config();

export class GroupInvitation {
  constructor({ group_id, invited_by, }) {
    this.group_id = group_id;
    this.invited_by = invited_by;
  }

  async save() {
    try {
      const token = crypto.randomBytes(32).toString("hex");
      const expires_at = new Date(Date.now() + 48 * 60 * 60 * 1000);

      const query = `
        INSERT INTO learning.study_group_invitations
        (group_id, invited_by,  token, expires_at)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;

      const values = [
        this.group_id,
        this.invited_by,
        token,
        expires_at
      ];

      const { rows } = await pool.query(query, values);

      const InvitationLink = `${process.env.CLIENT_URL}/groups/invite?token=${token}&group_id=${this.group_id}`;

      return { invitation: rows[0], InvitationLink, expires_at };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async join({ group_id, token, invited_email, invited_user_id }) {
    try {
      const findQuery = `
        SELECT * FROM learning.study_group_invitations
        WHERE group_id = $1 AND token = $2
      `;

      const { rows } = await pool.query(findQuery, [group_id, token]);

      if (rows.length === 0) {
        return { success: false, reason: "group not found" };
      }

      const invitation = rows[0];
      const isExpired = Date.now() > new Date(invitation.expires_at).getTime();
      if (isExpired) {
        await pool.query(
          `
            UPDATE learning.study_group_invitations
            SET token = NULL, invited_user_id = $1, invited_email = $2 status = 'expired', expires_at = NULL
            WHERE group_id = $3 AND token = $4
          `,
          [invited_user_id, invited_email, group_id, token]
        );

        return { success: false, reason: "token expired" };
      }

      // Accept the invitation
      const result = await pool.query(
        `
           UPDATE learning.study_group_invitations
            SET token = NULL, invited_user_id = $1, invited_email = $2 status = 'accepted', expires_at = NULL
            WHERE group_id = $3 AND token = $4
          RETURNING *
        `,
        [invited_user_id, invited_email, group_id, token]
      );

      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async decline({ group_id, token }) {
    try {
      const findQuery = `
        SELECT * FROM learning.study_group_invitations
        WHERE group_id = $1 AND token = $2
      `;

      const { rows } = await pool.query(findQuery, [group_id, token]);

      if (rows.length === 0) {
        return { success: false, reason: "group not found" };
      }

      const result = await pool.query(
        `
          UPDATE learning.study_group_invitations
          SET token = NULL, expires_at = NULL, status = 'declined'
          WHERE group_id = $1 AND token = $2
          RETURNING *
        `,
        [group_id, token]
      );

      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  static async getGroupLink({ group_id, created_by }) {
    try {
      // 1. Check if there is an existing, still valid invitation
      const findQuery = `
      SELECT *
      FROM learning.study_group_invitations
      WHERE group_id = $1
        AND invited_by = $2
        AND status = 'pending'
        AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 1
    `;

      const { rows } = await pool.query(findQuery, [group_id, created_by]);

      // 2. If valid invitation exists → return it
      if (rows.length > 0) {
        const invitation = rows[0];
        const InvitationLink = `${process.env.CLIENT_URL}/groups/invite?token=${invitation.token}&group_id=${group_id}`;

        return {
          new: false,
          invitation,
          InvitationLink,
          expires_at: invitation.expires_at
        };
      }

      // 3. Otherwise → create a fresh invitation
      const newInvite = new GroupInvitation({
        group_id,
        invited_by: created_by,
      });

      const created = await newInvite.save();

      return {
        new: true,
        ...created
      };

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

}
