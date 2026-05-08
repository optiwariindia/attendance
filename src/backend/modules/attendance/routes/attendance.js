import { Router } from "express";
import { asyncHandler } from "express-web-tools";
import attendanceController from "../controllers/attendance.js";
import { auth as authGuard, permission as permissionGuard } from "../../auth/guards/index.js";

const router = Router();

// --- All routes require authentication ---
router.use(authGuard);

/**
 * Personal Attendance History
 */
router.get("/", permissionGuard("attendance", "tracking", "view"), asyncHandler(async (req, res) => {
    const result = await attendanceController.getHistory(req.user._id, req.query);
    res.json({ status: "success", data: result });
}));

/**
 * Perform Clock In/Out
 */
router.put("/", permissionGuard("attendance", "tracking", "clock"), asyncHandler(async (req, res) => {
    const { type, gps } = req.body;
    const result = await attendanceController.clock(req.user._id, type, gps, req.origin);
    res.json({ status: "success", data: result });
}));

/**
 * Get Server Time
 */
router.get("/time", asyncHandler(async (req, res) => {
    const result = await attendanceController.getServerTime();
    res.json({ status: "success", ...result });
}));

/**
 * Admin: Get All Attendance Logs
 */
router.get("/logs", permissionGuard("attendance", "tracking", "manage"), asyncHandler(async (req, res) => {
    attendanceController.request = req;
    const result = await attendanceController.list(req.query, ["user"]);
    res.json({ status: "success", data: result });
}));

/**
 * Admin: Bulk Verify Logs
 */
router.post("/verify", permissionGuard("attendance", "tracking", "verify"), asyncHandler(async (req, res) => {
    const { ids } = req.body;
    const result = await attendanceController.verifyLogs(ids, req.origin);
    res.json({ status: "success", ...result });
}));

/**
 * Admin: Manual Correction
 */
router.post("/correction", permissionGuard("attendance", "tracking", "manage"), asyncHandler(async (req, res) => {
    const result = await attendanceController.correction(req.body, req.origin);
    res.json({ status: "success", data: result });
}));

export default router;
