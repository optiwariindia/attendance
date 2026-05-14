import mongoose from "mongoose";
import userModel from "../../auth/models/User.js";
import shiftModel from "../models/Shift.js";
import { Holiday } from "../../leaves/models/index.js";
import attendanceModel from "../models/Attendance.js";

const { DB } = process.env;
setInterval(() => {
    let today = new Date();
    const date = today.toISOString().split("T")[0];
    createAttendanceLog(date)
}, 1 * 1000);

async function createAttendanceLog(date) {
    const [isActive, isDeleted] = [true, false];
    await mongoose.connect(DB);

    // Fetch today's holiday
    const targetDate = new Date(date);
    const holiday = await Holiday.findOne({
        date: {
            $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
            $lte: new Date(targetDate.setHours(23, 59, 59, 999))
        },
        isDeleted: false
    });

    let users = await userModel
        .find({ isActive: true, isDeleted: false }, { origin: 1, employeeID: 1, name: 1, dob: 1, shift: 1, workPolicy: 1, _id: 1 })

    for (let index = 0; index < users.length; index++) {
        const user = users[index];
        if (!user.shift) continue;

        let temp = await attendanceModel.findOne({
            date, user: user._id, shift: user.shift, origin: user.origin, isActive, isDeleted
        })
        if (Boolean(temp)) continue;

        let dayContext = null;
        const dayOfWeek = new Date(date).getDay();
        const isWeeklyOff = user.workPolicy?.weeklyOff?.includes(dayOfWeek);

        if (isWeeklyOff) {
            dayContext = {
                type: "weekly-off",
                name: "Weekly Off"
            };
        } else if (holiday) {
            dayContext = {
                type: "holiday",
                name: holiday.name
            };
        }

        let attendanceLog = new attendanceModel({
            date,
            user: user._id,
            shift: user.shift,
            origin: user.origin,
            dayContext,
            isActive,
            isDeleted
        })
        await attendanceLog.save()
    }
}
// createAttendanceLog("2206-05-12")