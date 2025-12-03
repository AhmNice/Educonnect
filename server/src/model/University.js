import { pool } from "../config/db.config.js";

export class University {
  constructor({ name, location, contact_email }) {
    this.name = name;
    this.location = location;
    this.contact_email = contact_email;
  }

  // ======================
  // SAVE UNIVERSITY
  // ======================
  async save() {
    try {
      const result = await pool.query(
        `
      INSERT INTO core.universities (name, location, contact_email)
      VALUES ($1, $2, $3)
      ON CONFLICT (name) DO NOTHING
      RETURNING *;
      `,
        [this.name, this.location, this.contact_email]
      );

      if (!result.rows[0]) {
        return { message: "University already exists" };
      }

      return { university_data: result.rows[0] };
    } catch (error) {
      console.error("❌ Error saving university:", error.message);
      throw error;
    }
  }


  // ======================
  // FIND BY ID
  // ======================
  static async findById(university_id) {
    try {
      const result = await pool.query(
        `SELECT * FROM core.universities WHERE university_id = $1`,
        [university_id]
      );

      if (result.rowCount === 0) return null;
      return { university_data: result.rows[0] };
    } catch (error) {
      console.error("❌ Error finding university by ID:", error.message);
      throw error;
    }
  }

  // ======================
  // UPDATE UNIVERSITY
  // ======================
  static async updateUniversity(university_id, updates) {
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
        UPDATE core.universities
        SET ${fields.join(", ")}
        WHERE university_id = $${index}
        RETURNING *;
      `;

      values.push(university_id);
      const result = await pool.query(query, values);

      if (result.rowCount === 0) return null;
      return { updated_university: result.rows[0] };
    } catch (error) {
      console.error("❌ Error updating university:", error.message);
      throw error;
    }
  }

  // ======================
  // DELETE UNIVERSITY
  // ======================
  static async deleteUniversity(university_id) {
    try {
      const result = await pool.query(
        `DELETE FROM core.universities WHERE university_id = $1 RETURNING *;`,
        [university_id]
      );

      if (result.rowCount === 0) {
        console.log("⚠️ No university found to delete");
        return null;
      }

      console.log("🗑️ University deleted successfully");
      return { deleted_university: result.rows[0] };
    } catch (error) {
      console.error("❌ Error deleting university:", error.message);
      throw error;
    }
  }

  // ======================
  // LIST ALL UNIVERSITIES
  // ======================
  static async getAll() {
    try {
      const result = await pool.query(`
        SELECT * FROM core.universities ORDER BY created_at DESC;
      `);
      return { universities: result.rows };
    } catch (error) {
      console.error("❌ Error fetching universities:", error.message);
      throw error;
    }
  }
}
