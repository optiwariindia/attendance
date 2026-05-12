import { Router } from "express";
import attendanceRoutes from "./attendance.js";
import shiftRoutes from "./shift.js";

const router = Router();

router.use("/", attendanceRoutes);
router.use("/", shiftRoutes);

export default router;
