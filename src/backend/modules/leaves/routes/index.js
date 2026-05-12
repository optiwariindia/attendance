import { Router } from "express";
import holidayRoutes from "./holiday.js";
import leaveCategoryRoutes from "./leaveCategory.js";

const router = Router();

router.use("/", holidayRoutes);
router.use("/", leaveCategoryRoutes);

export default router;
