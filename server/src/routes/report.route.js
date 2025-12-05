import express from "express";
import { verifySession } from "../util/session.js";
import {
  createReport,
  updateReportStatus,
  getAllReports,
  getReportById,
} from "../controller/report.controller.js";
import { verifyRole } from "../util/verifyRole.js";

const reportRoute = express.Router();
reportRoute.post("/create-report", verifySession, createReport);
reportRoute.get("/all", verifySession, verifyRole(["admin"]), getAllReports);
reportRoute.get("/:report_id", verifySession, getReportById);
reportRoute.patch(
  "/status/:report_id", verifySession, verifyRole(["admin"]), updateReportStatus
);

export default reportRoute;
