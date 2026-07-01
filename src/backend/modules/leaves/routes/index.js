import { Router } from "express";
import holidayRoutes from "./holiday.js";
import leaveCategoryRoutes from "./leaveCategory.js";
import leaveApplicationRoutes from "./leaveApplication.js";
const router = Router();

router.use("/", holidayRoutes);
router.use("/", leaveCategoryRoutes);
router.use("/",leaveApplicationRoutes);
export default router;
