import { Router } from "express";
import authRoutes from "./auth/routes/index.js";
import organizationRoutes from "./organization/routes/index.js";
import attendanceRoutes from "./attendance/routes/index.js";
import leavesRoutes from "./leaves/routes/index.js";
import sseRoutes from "./sse/routes/index.js";
import "./email/index.js";
const router = Router();

// Mount all modules
router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/organization", organizationRoutes);
router.use("/api/v1/attendance", attendanceRoutes);
router.use("/api/v1/leaves", leavesRoutes);
router.use("/api/v1/events", sseRoutes); // subscribe to server sent events


export default router;