import { pool } from "../config/db.config.js";

export class Resource {
  constructor({
    uploader_id,
    course_id,
    file_url,
    access = "public",
    file_type,
    title, tags = [], description
  }) {
    this.uploader_id = uploader_id;
    this.course_id = course_id;
    this.file_url = file_url;
    this.access = access;
    this.file_type = file_type;
    this.title = title;
    this.tags = tags
    this.description = description
  }

  // -------------------------
  // SAVE NEW RESOURCE
  // -------------------------
  async save() {
    try {
      const query = `
        INSERT INTO learning.course_resources
        (uploader_id, course_id, file_url, access, file_type, title, tags, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;

      const values = [
        this.uploader_id,
        this.course_id,
        this.file_url,
        this.access,
        this.file_type,
        this.title,
        this.tags,
        this.description
      ];

      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error("Error saving resource:", error);
      throw error;
    }
  }

  // -------------------------
  // GET ALL RESOURCES
  // -------------------------
  static async getAllResources() {
    try {
      const query = `
          SELECT
        cr.resource_id,
        cr.title,
        cr.file_type AS type,
        cr.description,
        cr.uploader_id,
        cr.uploaded_at AS "uploadDate",
        c.course_title AS course,
        u.full_name AS author,
        cr.tags
      FROM learning.course_resources cr
      LEFT JOIN learning.courses c
        ON cr.course_id = c.course_id
      LEFT JOIN core.users u
        ON cr.uploader_id = u.user_id
      ORDER BY cr.uploaded_at DESC;
      `
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error("Error fetching all resources:", error);
      throw error;
    }
  }

  // -------------------------
  // GET RESOURCE BY ID
  // -------------------------
  static async getResourceById(id) {
    try {
      const query = `
        SELECT * FROM learning.course_resources
        WHERE resource_id = $1;
      `;
      const { rows } = await pool.query(query, [id]);

      if (rows.length === 0) return null;
      return rows[0];
    } catch (error) {
      console.error("Error fetching resource:", error);
      throw error;
    }
  }

  // -------------------------
  // GET ALL RESOURCES FOR A USER
  // -------------------------
  static async getResourcesByUser(uploader_id) {
    try {
      const query = `
        SELECT * FROM learning.course_resources
        WHERE uploader_id = $1
        ORDER BY created_at DESC;
      `;
      const { rows } = await pool.query(query, [uploader_id]);
      return rows;
    } catch (error) {
      console.error("Error fetching user resources:", error);
      throw error;
    }
  }
}
