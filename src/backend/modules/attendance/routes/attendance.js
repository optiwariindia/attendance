import express from "express";
import { asyncHandler, HttpError } from "express-web-tools";
import { auth as AuthGuard } from "../../auth/guards/index.js";
import controller from "../controllers/attendance.js";
import shiftModel from "../models/Shift.js";

function getToday(shift, action = "in") {
    // return new Date();
    let today = new Date();
    const yesterday = (new Date(today.setDate(today.getDate() - 1))).toISOString().split("T")[0];
    today = (new Date()).toISOString().split("T")[0]
    return today;
    const time = {
        start: shift.startTime.split(":").map(v => Number(v)),
        end: shift.endTime.split(":").map(v => Number(v))
    }
    if (time.start[0] < time.end[0]) {
        return today;
    } else {
        return ((new Date()).getHours() < 10) ? yesterday : today;
    }
}
const router = express.Router();
router
    .route("/")
    .get(AuthGuard, asyncHandler(
        async (req, res) => {
            controller.request = req;
            const data = await controller.list({},"user")
            return res.json({
                status: "success",
                data
            })
        }
    ))
    .post(AuthGuard, asyncHandler(
        async (req, res) => {
            controller.request = req;
            const data = await controller.list(req.body)
            return res.json({
                status: "success",
                data
            })
        }
    ))
router
    .route('/my')
    .get(AuthGuard, asyncHandler(async (req, res) => {
        controller.request = req;
        let data = await controller.list({ user: req?.user?._id })
        return res.json({
            message: `Total ${data.length} records found`,
            data
        })
    }))
    .post(AuthGuard, asyncHandler(async (req, res) => {
        controller.request = req;
        let data = await controller.list({ ...req.body, user: req?.user?._id })
        return res.json({
            message: `Total ${data.length} records found`,
            data
        })
    }))
router
    .get('/my/today', AuthGuard, asyncHandler(async (req, res) => {
        controller.request = req;
        let shift = await shiftModel.findById(req.user.shift);
        const today = getToday(shift);
        let data = await controller.findOne({ user: req?.user?._id, date: today }, "shift")
        console.log({user:req.user._id,today})
        if (!data) throw new HttpError(403, "Unauthorized");
        return res.json({
            message: ``,
            data
        })
    }))
    .get('/my/report', AuthGuard, asyncHandler(async (req, res) => {
        const { year, month } = req.query;
        const now = new Date();
        const rYear = parseInt(year) || now.getFullYear();
        const rMonth = parseInt(month) || (now.getMonth() + 1);

        const data = await controller.getReport(req.user._id, rYear, rMonth);
        return res.json({
            status: "success",
            data
        });
    }))
    .post("/clock", AuthGuard, asyncHandler(async (req, res, next) => {
        try {
            const { action, gps } = req.body;
            let shift = await shiftModel.findById(req.user.shift);
            const today = getToday(shift, action);
            controller.request = req;
            const data = await controller.clock(today, action, gps);
            res.json({
                message: "Successfully marked",
                data
            });
        } catch (err) {
            next(err);
        }
    }));

/*
/my:
    should return attendance of current user
/my/today:
    should return current day attendance of current user
/today:
    should return current day attendance
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

router.get("/", AuthGuard, async (req, res, next) => {
    try {
        controller.request=req;
        let date=(new Date()).toISOString().split("T")[0]
        const data = await controller.list({user:req.user._id,date});
        res.json({
            message:"success",
            data
        });
    } catch (err) {
        next(err);
    }
});
//*/
export default router;
