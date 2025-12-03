import { pool } from "../config/db.config.js";

export class Course {
  constructor({ course_code, course_title, department, semester, created_by }) {
    this.course_code = course_code;
    this.course_title = course_title;
    this.department = department;
    this.semester = semester;
    this.created_by = created_by;
  }
  // ==============================
  // Create new course
  // ==============================
  async save() {
    try {
      const query = `
        INSERT INTO learning.courses (course_code, course_title, department, semester, created_by)
        VALUES ($1, $2, $3, $4,$5)
        RETURNING *;
      `;
      const values = [this.course_code, this.course_title, this.department, this.semester, this.created_by];
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error("❌ Error saving course:", error.message);
      throw error;
    }
  }
  // =============================
  // Get all courses
  //=============================
  static async getAll() {
    try {
      const { rows } = await pool.query("SELECT * FROM learning.courses ORDER BY course_code ASC;");
      return rows;
    } catch (error) {
      console.error("❌ Error fetching courses:", error.message);
      throw error;
    }
  }
  // =============================
  // Update course by course_code
  //=============================
  static async update(course_id, data) {
    try {
      const { course_code, course_title, department, semester } = data;
      const query = `
        UPDATE learning.courses
        SET course_title = COALESCE($1, course_title),
            department = COALESCE($2, department),
            semester = COALESCE($3, semester),
            course_code = COALESCE($4, course_code)
        WHERE course_id = $5
        RETURNING *;
      `;
      const values = [course_title, department, semester, course_code, course_id];
      const { rows } = await pool.query(query, values);
      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error updating course:", error.message);
      throw error;
    }
  }
  static async findById(course_id) {
    try {
      const { rows } = await pool.query(`SELECT * FROM learning.courses WHERE course_id = $1`, [course_id]);
      return rows[0]
    } catch (error) {
      console.log('error finding course by id', error.message)
      throw error
    }
  }
  // ================================
  //  Delete course by course_code
  // ================================
  static async delete(course_id) {
    try {
      const { rowCount } = await pool.query(
        "DELETE FROM learning.courses WHERE course_id = $1",
        [course_id]
      );
      return rowCount > 0; // true if deleted
    } catch (error) {
      console.error("❌ Error deleting course:", error.message);
      throw error;
    }
  }
}
