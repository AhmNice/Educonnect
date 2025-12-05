import express from "express"
import { verifySession } from "../util/session.js"
import { verifyRole } from "../util/verifyRole.js"
import { getActivityLog, getActivityLogByUserId, getUserLog, recentActivity } from "../util/userLogs.js"
const logRoute = express.Router()

logRoute.get("/get-all-log",verifySession, verifyRole(['admin']), getActivityLog)
logRoute.get("/get-recent-log",verifySession, verifyRole(['admin']), recentActivity)
logRoute.get("/get-user-log", verifySession, verifyRole(['admin', 'student']), getUserLog)
logRoute.get("/get-user-log/:user_id", verifySession, verifyRole(['admin', 'student']), getActivityLogByUserId)
export default logRoute

 