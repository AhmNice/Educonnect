import { pool } from "../config/db.config.js";
import { Report } from "../model/Report.js";
import { User } from "../model/User.js";
import { handleInputError } from "../util/handleInputValidation.js";
import { logUserActivity } from "../util/userLogs.js";

export const createReport = async (req, res) => {
  await handleInputError(req, res);

  const { reporter_id, reported_user_id, reason } = req.body;

  try {
    // 1️⃣ Validate reporter and reported user exist
    const reporter = await User.findUserById(reporter_id);
    const reportedUser = await User.findUserById(reported_user_id);

    if (!reporter || !reportedUser) {
      return res.status(404).json({
        success: false,
        message: "Either reporter or reported user not found",
      });
    }

    // 2️⃣ Create new report instance
    const newReport = new Report({
      reporter_id,
      reported_user_id,
      reason,
      status: "pending",
    });

    // 3️⃣ Save report
    const saved = await newReport.save();

    // 4️⃣ Log activity for the reporter
    await logUserActivity(
      reporter_id,
      "user_reported",
      `Reported user ${reported_user_id} for: ${reason}`
    );

    return res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      report: saved,
    });

  } catch (error) {
    console.error("❌ Error creating report:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



export const updateReportStatus = async (req, res) => {
  await handleInputError(req, res);

  const { report_id } = req.params;
  const { newStatus, admin_id } = req.body;

  if (!["pending", "reviewed", "resolved", "dismissed"].includes(newStatus)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status value",
    });
  }

  try {
    // 1️⃣ Update status
    const updated = await Report.updateStatus(report_id, newStatus);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // 2️⃣ Log admin action
    await logUserActivity(
      admin_id,
      "report_status_update",
      `Updated report #${report_id} to status '${newStatus}'`
    );

    return res.status(200).json({
      success: true,
      message: "Report status updated",
      report: updated,
    });

  } catch (error) {
    console.error("❌ Error updating report status:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



export const getAllReports = async (req, res) => {
  try {
    const query = `SELECT * FROM analytics.reports ORDER BY created_at DESC`;
    const { rows } = await pool.query(query);

    return res.status(200).json({
      success: true,
      message: "Reports fetched",
      reports: rows,
    });

  } catch (error) {
    console.error("❌ Error fetching reports:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



export const getReportById = async (req, res) => {
  const { report_id } = req.params;

  try {
    const query = `SELECT * FROM analytics.reports WHERE report_id = $1`;
    const { rows } = await pool.query(query, [report_id]);

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Report fetched",
      report: rows[0],
    });

  } catch (error) {
    console.error("❌ Error fetching report:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
