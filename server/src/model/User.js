import { pool } from "../config/db.config.js";
import crypto from "crypto";
import { generateOTP } from "../util/generateToken.js";

export class User {
  constructor({
    full_name,
    email,
    password_hash,
    university_id,
    department,
    role = "student",
    status = "active",
    otp_code,
    otp_expiry,
  }) {
    this.full_name = full_name;
    this.email = email;
    this.password_hash = password_hash;
    this.university_id = university_id;
    this.department = department;
    this.role = role;
    this.status = status;
    this.otp_code = otp_code;
    this.otp_expiry = otp_expiry;
  }

  // ======================
  // SAVE USER
  // ======================
  async save_user() {
    try {

      const saved_user = await pool.query(
        `
        INSERT INTO core.users
          (full_name, email, password_hash, university_id, department, role, status, otp_code, otp_expiry)
        VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9)
        RETURNING *;
        `,
        [
          this.full_name,
          this.email,
          this.password_hash,
          this.university_id,
          this.department,
          this.role,
          this.status,
          this.otp_code,
          this.otp_expiry
        ]
      );

      const { password_hash, reset_token,
        reset_token_expiry,
        otp_code,
        otp_expiry, ...rest } = saved_user.rows[0];
      return { user_data: rest };
    } catch (error) {
      console.error("❌ Error saving user:", error.message);
      throw error;
    }
  }

  // ======================
  // GET ALL USERS SORTED BY ID DESC
  // ======================
  static async getAll() {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM core.users ORDER BY user_id DESC;"
      );
      return rows.map(({ password_hash, reset_token,
        reset_token_expiry,
        otp_code,
        otp_expiry, ...safe_data }) => safe_data);
    } catch (error) {
      console.error("❌ Error fetching users:", error.message);
      throw error;
    }
  }

  // ======================
  // FIND USER BY ID
  // ======================
  static async findUserById(user_id) {
    try {
      const result = await pool.query(
        `SELECT * FROM core.users WHERE user_id = $1`,
        [user_id]
      );

      if (result.rowCount === 0) return null;

      const { password_hash, reset_token,
        reset_token_expiry,
        otp_code,
        otp_expiry, ...safe_data } = result.rows[0];
      return { user_data: safe_data };
    } catch (error) {
      console.error("❌ Error finding user by ID:", error.message);
      throw error;
    }
  }

  // ======================
  // FIND USER BY EMAIL
  // ======================
  static async findUserByEmail(email) {
    try {
      const result = await pool.query(
        `SELECT * FROM core.users WHERE email = $1`,
        [email]
      );

      if (result.rowCount === 0) return null;

      const { password_hash, reset_token,
        reset_token_expiry,
        otp_code,
        otp_expiry, ...safe_data } = result.rows[0];
      return {
        user_data: safe_data, password_hash, reset_token,
        reset_token_expiry,
      };
    } catch (error) {
      console.error("❌ Error finding user by email:", error.message);
      throw error;
    }
  }

  // ======================
  // VERIFY USER BY OTP
  // ======================
  static async verifyUser({ email, otp_code }) {
    try {
      const query = `SELECT * FROM core.users WHERE email = $1 AND otp_code = $2`;
      const result = await pool.query(query, [email, otp_code]);

      if (result.rowCount === 0) {
        return { success: false, message: "Invalid or expired OTP code" };
      }

      const user = result.rows[0];

      // Compare current time with OTP expiry
      if (Date.now() > new Date(user.otp_expiry).getTime()) {
        return { success: false, message: "OTP expired" };
      }

      // Mark user as verified and clear OTP
      const updateResult = await pool.query(
        `UPDATE core.users
       SET otp_code = NULL, otp_expiry = NULL, is_verified = TRUE
       WHERE user_id = $1
       RETURNING *`,
        [user.user_id]
      );

      const {
        password_hash, reset_token,
        reset_token_expiry,
        otp_expiry, ...safe_data } = updateResult.rows[0];
      return { success: true, user_data: safe_data };
    } catch (error) {
      console.error("❌ Error verifying user:", error.message);
      throw error;
    }
  }


  // ======================
  // UPDATE USER
  // ======================
  static async updateUser(user_id, updates) {
    try {
      const fields = [];
      const values = [];
      let index = 1;

      for (const [key, value] of Object.entries(updates)) {
        fields.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }

      if (fields.length === 0)
        throw new Error("No valid fields provided for update.");

      const query = `
        UPDATE core.users
        SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $${index}
        RETURNING *;
      `;
      values.push(user_id);

      const result = await pool.query(query, values);
      if (result.rowCount === 0) return null;

      const { password_hash, reset_token,
        reset_token_expiry,
        otp_code,
        otp_expiry, ...safe_data } = result.rows[0];
      return { user_data: safe_data };
    } catch (error) {
      console.error("❌ Error updating user:", error.message);
      throw error;
    }
  }

  // ======================
  // DELETE USER
  // ======================
  static async deleteUser(user_id) {
    try {
      const result = await pool.query(
        `DELETE FROM core.users WHERE user_id = $1 RETURNING *`,
        [user_id]
      );

      if (result.rowCount === 0) return null;

      const { password_hash, ...safe_data } = result.rows[0];
      return { deleted_user: safe_data };
    } catch (error) {
      console.error("❌ Error deleting user:", error.message);
      throw error;
    }
  }

  // ======================
  // SUSPEND OR ACTIVATE USER
  // ======================
  static async setUserStatus(user_id, status) {
    try {
      const allowedStatuses = ["active", "suspended"];
      if (!allowedStatuses.includes(status.toLowerCase())) {
        throw new Error("Invalid status. Allowed: active | suspended");
      }

      const result = await pool.query(
        `UPDATE core.users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING *`,
        [status, user_id]
      );

      if (result.rowCount === 0) return null;

      const { password_hash, reset_token,
        reset_token_expiry,
        otp_code,
        otp_expiry, ...safe_data } = result.rows[0];
      return { user_data: safe_data };
    } catch (error) {
      console.error("❌ Error updating user status:", error.message);
      throw error;
    }
  }

  // ======================
  // GENERATE AND SAVE RESET PASSWORD TOKEN
  // ======================
  static async generatePasswordResetToken(email) {
    const token = crypto.randomBytes(32).toString("hex");
    const expires_at = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    try {
      const result = await pool.query(
        `UPDATE core.users
         SET reset_token = $1, reset_token_expiry = $2
         WHERE email = $3
         RETURNING user_id`,
        [token, expires_at, email]
      );

      if (result.rowCount === 0) return null;

      return token;
    } catch (error) {
      console.error("❌ Error generating reset token:", error.message);
      throw error;
    }
  }
  static async getAllUsers() {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM core.users ORDER BY user_id DESC;"
      );
      return rows;
    } catch (error) {
      console.error("❌ Error fetching users:", error.message);
      throw error;
    }
  }
}
