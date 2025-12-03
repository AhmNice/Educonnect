import { pool } from "../config/db.config.js";


export class CourseResource {
  constructor({ uploader_id, course_id, file_url, file_type, title }) {
    this.uploader_id = uploader_id;
    this.course_id = course_id;
    this.file_url = file_url;
    this.file_type = file_type;
    this.title = title;
  }

  // ===================
  // Create (Upload)
  // ==================
  async save() {
    try {
      const query = `
        INSERT INTO learning.course_resources
          (uploader_id, course_id, file_url, file_type, title)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const values = [
        this.uploader_id,
        this.course_id,
        this.file_url,
        this.file_type,
        this.title,
      ];
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error("❌ Error saving course resource:", error.message);
      throw error;
    }
  }

  // =============
  // Read All
  // =============
  static async getAll() {
    try {
      const query = `
        SELECT r.*, u.full_name AS uploader_name, c.course_title
        FROM learning.course_resources r
        LEFT JOIN core.users u ON r.uploader_id = u.user_id
        LEFT JOIN learning.courses c ON r.course_id = c.course_id
        ORDER BY r.uploaded_at DESC;
      `;
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error("❌ Error fetching course resources:", error.message);
      throw error;
    }
  }

  // ===============
  // Read by Course
  // ==============
  static async getByCourse(course_id) {
    try {
      const query = `
        SELECT r.*, u.full_name AS uploader_name
        FROM learning.course_resources r
        LEFT JOIN core.users u ON r.uploader_id = u.user_id
        WHERE r.course_id = $1
        ORDER BY r.uploaded_at DESC;
      `;
      const { rows } = await pool.query(query, [course_id]);
      return rows;
    } catch (error) {
      console.error("❌ Error fetching resources for course:", error.message);
      throw error;
    }
  }

  // =============
  // Read by ID
  // =============
  static async getById(resource_id) {
    try {
      const query = `
        SELECT r.*, u.full_name AS uploader_name, c.course_title
        FROM learning.course_resources r
        LEFT JOIN core.users u ON r.uploader_id = u.user_id
        LEFT JOIN learning.courses c ON r.course_id = c.course_id
        WHERE r.resource_id = $1;
      `;
      const { rows } = await pool.query(query, [resource_id]);
      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error fetching course resource by ID:", error.message);
      throw error;
    }
  }

  // =============
  // Update
  // =============
  static async update(resource_id, data) {
    try {
      const { title, file_url, file_type } = data;
      const query = `
        UPDATE learning.course_resources
        SET
          title = COALESCE($1, title),
          file_url = COALESCE($2, file_url),
          file_type = COALESCE($3, file_type)
        WHERE resource_id = $4
        RETURNING *;
      `;
      const { rows } = await pool.query(query, [title, file_url, file_type, resource_id]);
      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error updating course resource:", error.message);
      throw error;
    }
  }

  // =============
  // Delete
  // =============
  static async delete(resource_id) {
    try {
      const { rowCount } = await pool.query(
        "DELETE FROM learning.course_resources WHERE resource_id = $1",
        [resource_id]
      );
      return rowCount > 0;
    } catch (error) {
      console.error("❌ Error deleting course resource:", error.message);
      throw error;
    }
  }
}
