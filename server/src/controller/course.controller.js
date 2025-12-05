import { Course } from "../model/Course.js";
import { handleInputError } from "../util/handleInputValidation.js";
import { pool } from "../config/db.config.js";
import { logUserActivity } from "../util/userLogs.js";

export const createCourse = async (req, res) => {
  const { course_code, course_title, department, semester, user_id } = req.body;

  await handleInputError(req, res);

  try {
    const exists = await pool.query(
      "SELECT * FROM learning.courses WHERE course_code = $1",
      [course_code]
    );

    if (exists.rowCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Course with this course code already exists",
      });
    }

    const newCourse = new Course({
      course_code,
      course_title,
      department,
      semester,
      created_by: user_id,
    });

    const saved_course = await newCourse.save();

    // 🔥 Log activity
    await logUserActivity(
      user_id,
      "course_create",
      `Created course: ${course_code} - ${course_title}`
    );

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: saved_course,
    });
  } catch (error) {
    console.error("❌ Error creating course:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.getAll();

    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      courses,
    });
  } catch (error) {
    console.error("❌ Error fetching courses:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const updateCourse = async (req, res) => {
  const { course_id } = req.params;
  const updates = req.body;

  await handleInputError(req, res);

  try {
    const updated_course = await Course.update(course_id, updates);

    if (!updated_course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Extract user performing the update
    const actor_id = req.user?.user_id || updates.updated_by;

    // 🔥 Log activity
    await logUserActivity(
      actor_id,
      "course_update",
      `Updated course ID: ${course_id}`
    );

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updated_course,
    });
  } catch (error) {
    console.error("❌ Error updating course:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteCourse = async (req, res) => {
  const { course_id } = req.params;

  try {
    const deleted = await Course.delete(course_id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const actor_id = req.user?.user_id;

    // 🔥 Log activity
    await logUserActivity(
      actor_id,
      "course_delete",
      `Deleted course ID: ${course_id}`
    );

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting course:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
