import { Router } from "express";
import attendanceRoutes from "./attendance.js";

const router = Router();

router.use("/", attendanceRoutes);

export default router;
