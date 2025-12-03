import express from 'express';
import { getAllUniversities, getUniversityById, createUniversity, updateUniversity, deleteUniversity } from '../controller/university.controller.js';
import { verifySession } from '../util/session.js';
import { body } from 'express-validator';
import { verifyRole } from '../util/verifyRole.js';

const universityRoute = express.Router();

universityRoute.post("/create-university",[
  body('name').notEmpty().withMessage('University name is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('contact_email').isEmail().withMessage('Valid contact email is required')
],verifySession, verifyRole(['admin']), createUniversity);
universityRoute.get("/get-all-universities", getAllUniversities);
universityRoute.get("/:university_id", verifySession, getUniversityById);
universityRoute.patch("/update/:university_id", verifySession, verifyRole(['admin']), updateUniversity);
universityRoute.delete("/delete/:university_id", verifySession, verifyRole(['admin']), deleteUniversity);

export default  universityRoute
