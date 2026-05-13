import express from "express";
import { auth as AuthGuard } from "../../auth/guards/index.js";
import controller from "../controllers/attendance.js";

const router = express.Router();

// User routes
router.post("/clock", AuthGuard, async (req, res, next) => {
    try {
        const { action, gps, origin } = req.body;
        controller.request=req;
        const result = await controller.clock(req.user, action, gps, origin || req.headers.host);
        res.json(result);
    } catch (err) {
        next(err);
    }
});

router.get("/history", AuthGuard, async (req, res, next) => {
    try {
        controller.request=req;
        const result = await controller.getHistory(req.user._id, req.query);
        res.json(result);
    } catch (err) {
        next(err);
    }
});

export default router;
