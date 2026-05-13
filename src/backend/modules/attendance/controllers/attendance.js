import { CrudController, HttpError } from "express-web-tools";
import { Attendance, Shift } from "../models/index.js";
import User from "../../auth/models/User.js";
import eventStream from "../../../core/events.js";
import "../events/generateDailyEntries.js";

class AttendanceController extends CrudController {
    constructor() {
        super(Attendance);
    }

    /**
     * Midnight Routine: Create blank attendance entries for all active users
     */
    async generateDailyEntries(origin) {
        const users = await User.find({ isDeleted: false, isActive: true });
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const entries = users.map(user => ({
            user: user._id,
            shift: user.shift,
            origin,
            in: { gps: { type: "Point", coordinates: [0, 0] } },
            out: { gps: { type: "Point", coordinates: [0, 0] } },
            break: [],
            isDeleted: false
        }));

        // Use insertMany for efficiency
        if (entries.length > 0) {
            await this.model.insertMany(entries);
        }

        console.log(`[Midnight] Created ${entries.length} blank attendance entries for ${now.toDateString()}`);
        return { count: entries.length };
    }

    /**
     * Perform Clock In/Out
     */
    async clock(user, action, gpsData, origin) {
        if (!["in", "out"].includes(action)) {
            throw new HttpError(400, "Invalid action type");
        }

        const now = new Date();
        
        // Extract GPS data from nested structure if present
        let gps = {
            type: "Point",
            coordinates: [0, 0]
        };
        let gpsAccuracy = undefined;

        if (gpsData) {
            if (Array.isArray(gpsData.coordinates)) {
                gps.coordinates = gpsData.coordinates;
            } else if (gpsData.lng !== undefined && gpsData.lat !== undefined) {
                gps.coordinates = [gpsData.lng, gpsData.lat];
            }
            
            if (gpsData.accuracy) {
                gpsAccuracy = gpsData.accuracy;
            }
        }

        const userWithShift = await User.findById(user._id).populate("shift");
        const shift = userWithShift?.shift;

        // Find the record to update
        let record = await this.findActiveRecord(user._id, shift, now, action);

        if (!record) {
            // Fallback: if no midnight entry exists (e.g., new user), create one
            record = await this.model.create({
                user: user._id,
                shift: shift?._id,
                origin,
                in: { gps: { type: "Point", coordinates: [0, 0] } },
                out: { gps: { type: "Point", coordinates: [0, 0] } }
            });
        }

        if (action === "in") {
            if (!record.in.time) {
                // First punch-in of the day
                record.in.time = now;
                record.in.gps = gps;
                record.in.status = this.calculateStatus(shift, "in", now);
                if (gpsAccuracy) record.in.gpsAccuracy = gpsAccuracy;
            } else if (record.out && record.out.time) {
                // Re-punching in: Move previous out and this in to breaks
                const start = record.out.time;
                const end = now;
                const duration = Math.round((end - start) / (1000 * 60)); // in minutes

                record.break.push({
                    start,
                    end,
                    duration
                });

                // Reset out time for the next punch-out
                record.out.time = undefined;
                record.out.status = undefined;
                record.out.gpsAccuracy = undefined;
            }
        } else {
            // Action is "out"
            record.out.time = now;
            record.out.gps = gps;
            record.out.status = this.calculateStatus(shift, "out", now);
            if (gpsAccuracy) record.out.gpsAccuracy = gpsAccuracy;
        }

        await record.save();

        // Emit event
        eventStream.emit("attendance.clock", {
            userId: user._id,
            employeeID: user.employeeID,
            origin,
            action,
            record,
            serverTime: now.toISOString()
        });

        return record;
    }

    /**
     * Find the correct attendance record for the punch
     * Handles night shifts where out/re-in might happen on the next calendar day
     */
    async findActiveRecord(userId, shift, now, action) {
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);

        const yesterdayStart = new Date(todayStart);
        yesterdayStart.setDate(yesterdayStart.getDate() - 1);

        // Check if shift is a night shift
        let isNightShift = false;
        if (shift) {
            const [sH, sM] = shift.startTime.split(":").map(Number);
            const [eH, eM] = shift.endTime.split(":").map(Number);
            isNightShift = (eH < sH) || (eH === sH && eM < sM);
        }

        if (isNightShift) {
            // For night shift, if it's early morning (e.g., before noon), 
            // we likely want yesterday's record
            if (now.getHours() < 12) {
                const record = await this.model.findOne({
                    user: userId,
                    createdAt: { $gte: yesterdayStart, $lt: todayStart },
                    isDeleted: false
                }).sort({ createdAt: -1, _id: -1 });
                if (record) return record;
            }
        }

        // Default: find today's record
        return await this.model.findOne({
            user: userId,
            createdAt: { $gte: todayStart },
            isDeleted: false
        }).sort({ createdAt: -1, _id: -1 });
    }

    calculateStatus(shift, action, time) {
        if (!shift) return "ontime";

        const now = new Date(time);
        const [sH, sM] = shift.startTime.split(":").map(Number);
        const [eH, eM] = shift.endTime.split(":").map(Number);

        const shiftStart = new Date(now);
        shiftStart.setHours(sH, sM, 0, 0);

        const shiftEnd = new Date(now);
        shiftEnd.setHours(eH, eM, 0, 0);

        // Adjust for night shift
        if (shiftEnd < shiftStart) {
            if (action === "out") shiftEnd.setDate(shiftEnd.getDate() + 1);
            else if (now.getHours() < 12) shiftStart.setDate(shiftStart.getDate() - 1);
        }

        if (action === "in") {
            const grace = (shift.gracePeriod?.in || 0) * 60 * 1000;
            return now > (shiftStart.getTime() + grace) ? "late" : "ontime";
        } else {
            return now > shiftEnd ? "OT" : "ontime";
        }
    }

    async getHistory(userId, filters = {}) {
        const { startDate, endDate } = filters;
        const query = { user: userId, isDeleted: false };

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        return await this.list(query, null, { createdAt: -1, _id: -1 });
    }
}

export default new AttendanceController();
