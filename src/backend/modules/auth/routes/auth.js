import { Router } from "express";
import { asyncHandler } from "express-web-tools";
import authController from "../controllers/auth.js";
import { auth as authGuard } from "../guards/index.js";

const router = Router();

// Helper to set authorization cookie
const setAuthCookie = (res, token) => {
    res.cookie("authorization", `Bearer ${token}`, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 day
    });
};

router.post("/login", asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const origin = req.origin;
    const result = await authController.login(username, password, origin);

    // Set cookie
    setAuthCookie(res, result.token);

    res.json({
        status: "success",
        ...result
    });
}));

router.post("/register", asyncHandler(async (req, res) => {
    const { companyName, adminEmail, adminPassword, domain } = req.body;
    const result = await authController.register(companyName, adminEmail, adminPassword, domain);
    res.status(201).json({
        status: "success",
        ...result
    });
}));

router.delete("/me", authGuard, asyncHandler(async (req, res) => {
    res.clearCookie("authorization");
    const result = await authController.logout(req.user, req.origin);
    res.json({
        status: "success",
        ...result
    });
}));

router.post("/forgot-password", asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await authController.forgotPassword(email);
    res.json({
        status: "success",
        ...result
    });
}));

export default router;
