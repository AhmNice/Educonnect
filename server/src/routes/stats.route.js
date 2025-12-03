import express from 'express'
import { platformMetrics, userList } from '../controller/stats.controller.js';
import { verifySession } from '../util/session.js';
import { verifyRole } from '../util/verifyRole.js';
const statsRoute = express.Router();

statsRoute.get("/admin/platform-metrics", verifySession, verifyRole(['admin']), platformMetrics);
statsRoute.get("/admin/user-list", verifySession, verifyRole(['admin']), userList);
export default statsRoute;