import { Router } from "express";
import branchRoutes from "./branch.js";
import departmentRoutes from "./department.js";
import designationRoutes from "./designation.js";
import debugRouter from "../../../core/utils/debugRouter.js";
const router = Router();

router.use("/", branchRoutes);
router.use("/", departmentRoutes);
router.use("/", designationRoutes);

export default router;
