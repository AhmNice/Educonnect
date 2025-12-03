import express from 'express';
import { createCourse, deleteCourse, getAllCourses, updateCourse } from '../controller/course.controller.js';
import { verifySession } from '../util/session.js';
import { body } from 'express-validator';
const courseRoute = express.Router();
courseRoute.post("/create-course", [
  body('course_code').notEmpty().withMessage("course code is required"),
  body("course_title").notEmpty().withMessage("course title is required"), body("department").notEmpty().withMessage("department is required"),
  body("semester").notEmpty().withMessage("semester is required")
], verifySession, createCourse);
courseRoute.get("/get-all-course", verifySession, getAllCourses);
courseRoute.put("/update-course/:course_id", verifySession, updateCourse);
courseRoute.delete("/delete-course/:course_id", verifySession, deleteCourse);

export default courseRoute