import { Router } from "express";
import authRoutes from "./auth.js";
import userAccountRoutes from "./userAccount.js";
import roleRoutes from "./role.js";
import permissionRoutes from "./permission.js";

const router = Router();

router.use("/", authRoutes);
router.use("/", userAccountRoutes);
router.use("/", roleRoutes);
router.use("/", permissionRoutes);

export default router;
