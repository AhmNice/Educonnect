import express from "express"
import { createGroup, deleteGroup, generateInvitationLink, getAllGroups, getGroupById, getInvitationLink, getUserGroups, joinGroup, joinGroupByInvite, updateGroup } from "../controller/group.controller.js";
import { verifySession } from "../util/session.js";
import { verifyRole } from "../util/verifyRole.js";
import { body, param, query } from "express-validator";
const groupRoute = express.Router();
groupRoute.post("/create-group",
  [
    body('group_name').notEmpty().withMessage('Group name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('course_id').notEmpty().withMessage('course is required'),
    body("created_by").notEmpty().withMessage("Creator ID is required"),
    body('max_members').isInt({ min: 1 }).withMessage('Max members must be a positive integer'),
    body('meeting_schedule').notEmpty().withMessage('Meeting schedule is required'),
    body('tags').isArray().withMessage('Tags must be an array')
  ],
  verifySession, verifyRole(['admin', 'student']), createGroup)
groupRoute.post("/join-group/:group_id/:user_id",
  verifySession, verifyRole(['student']),
  [
    body('user_id').notEmpty().withMessage('User ID is required'),
    body('group_id').notEmpty().withMessage('Group ID is required')
  ], joinGroup)
groupRoute.post("/join-group-by-invite/:group_id", verifySession, verifyRole(['student']), [
  param('group_id').notEmpty().withMessage('Group ID is required'),
  query('token').notEmpty().withMessage('Invite token is required'),
  query('user_id').notEmpty().withMessage('User ID is required')
], joinGroupByInvite)
groupRoute.get("/get-public-groups", verifySession, verifyRole(['admin', 'student']), getAllGroups);
groupRoute.get("/get-user-groups/:user_id", verifySession, verifyRole(['admin', 'student']),
  [
    param('user_id').notEmpty().withMessage('User ID is required')
  ],
  getUserGroups)
groupRoute.get("/get-group-info/:group_id", verifySession, verifyRole(['admin', 'student']), [
  param('group_id').notEmpty().withMessage('Group ID is required')
],
  getGroupById)
groupRoute.get("/get-group-link/:group_id/:user_id", verifySession, verifyRole(['admin', 'student']),
  [
    param('group_id').notEmpty().withMessage('Group ID is required'),
    param('user_id').notEmpty().withMessage('User ID is required')
  ], getInvitationLink);
groupRoute.post("/generate-new-link/:group_id/:user_id", verifySession, verifyRole(['admin', 'student']),
  [
    param('group_id').notEmpty().withMessage('Group ID is required'),
    param('user_id').notEmpty().withMessage('User ID is required')
  ],
  generateInvitationLink);

groupRoute.patch("/update-group/:group_id", verifySession, verifyRole(['admin', 'student']),
  [
    param('group_id').notEmpty().withMessage('Group ID is required')
  ],
  updateGroup)
groupRoute.delete("/delete-group/:group_id", verifySession, verifyRole(['admin', 'student']), [
  param('group_id').notEmpty().withMessage('Group ID is required')
], deleteGroup)


export default groupRoute