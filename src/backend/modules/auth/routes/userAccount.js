import { Router } from "express";
import { asyncHandler } from "express-web-tools";
import userAccountController from "../controllers/userAccount.js";
import { auth as authGuard, permission as permissionGuard } from "../guards/index.js";

const router = Router();

// --- User Self-Service (Protected by authGuard) ---
router.use(authGuard);

router.get("/me", asyncHandler(async (req, res) => {
    const result = await userAccountController.getMe(req.user);
    res.json({ status: "success", data: result });
}));

router.patch("/me", asyncHandler(async (req, res) => {
    const result = await userAccountController.updateProfile(req.user._id, req.body);
    res.json({ status: "success", data: result });
}));

router.post("/me/change-password", asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const result = await userAccountController.changePassword(req.user._id, currentPassword, newPassword);
    res.json({ status: "success", ...result });
}));

// --- Admin User Management (Protected by permissionGuard) ---
const adminPermission = (action) => permissionGuard("users", "profiles", action);

router.get("/users", adminPermission("view"), asyncHandler(async (req, res) => {
    userAccountController.request = req;
    const result = await userAccountController.list(req.query);
    res.json({ status: "success", data: result });
}));

router.patch("/users/:userId", adminPermission("manage"), asyncHandler(async (req, res) => {
    const result = await userAccountController.updateUserDetails(req.params.userId, req.body);
    res.json({ status: "success", data: result });
}));

router.post("/users/:userId/reset-password", adminPermission("manage"), asyncHandler(async (req, res) => {
    const { newPassword } = req.body;
    const result = await userAccountController.resetPassword(req.user, req.params.userId, newPassword);
    res.json({ status: "success", ...result });
}));

router.patch("/users/:userId/role", adminPermission("manage"), asyncHandler(async (req, res) => {
    const { role } = req.body;
    const result = await userAccountController.changeRole(req.params.userId, role);
    res.json({ status: "success", data: result });
}));

router.patch("/users/:userId/status", adminPermission("manage"), asyncHandler(async (req, res) => {
    const { status } = req.body;
    const result = await userAccountController.setStatus(req.params.userId, status);
    res.json({ status: "success", data: result });
}));

router.patch("/users/:userId/activate", adminPermission("manage"), asyncHandler(async (req, res) => {
    const result = await userAccountController.activateAccount(req.params.userId);
    res.json({ status: "success", data: result });
}));

router.patch("/users/:userId/deactivate", adminPermission("manage"), asyncHandler(async (req, res) => {
    const result = await userAccountController.deactivateAccount(req.params.userId);
    res.json({ status: "success", data: result });
}));

export default router;
