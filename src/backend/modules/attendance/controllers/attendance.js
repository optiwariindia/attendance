import { CrudController, HttpError } from "express-web-tools";
import { Attendance } from "../models/index.js";
import eventStream from "../../../core/events.js";

class AttendanceController extends CrudController {
    constructor() {
        super(Attendance);
    }

    /**
     * Perform Clock In/Out
     * @param {object} user - User object containing _id and employeeID
     * @param {string} action - 'in' or 'out'
     * @param {object} gps - optional { lat, lng, accuracy }
     * @param {string} origin 
     */
    async clock(user, action, gpsData, origin) {
        if (!["in", "out"].includes(action)) {
            throw new HttpError(400, "Invalid action type");
        }

        const now = new Date();
        const data = {
            user: user._id,
            action,
            timestamp: now, // Always server time
            origin
        };

        if (gpsData && gpsData.lat !== undefined && gpsData.lng !== undefined) {
            data.gps = {
                type: "Point",
                coordinates: [gpsData.lng, gpsData.lat] // GeoJSON is [lng, lat]
            };
            if (gpsData.accuracy) {
                data.gpsAccuracy = gpsData.accuracy;
            }
        }

        const record = await this.model.create(data);

        // Emit event to the global stream using employeeID
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
     * Get Personal Attendance History
     */
    async getHistory(userId, filters = {}) {
        const { startDate, endDate, page = 1, limit = 50 } = filters;
        
        const query = { user: userId, isDeleted: false };
        
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        return await this.list(query, null, { timestamp: -1 });
    }

    /**
     * Get Server Time
     */
    async getServerTime() {
        return { serverTime: new Date() };
    }

    /**
     * Bulk Verify Attendance (Admin)
     */
    async verifyLogs(ids, origin) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new HttpError(400, "List of IDs is required");
        }

        await this.model.updateMany(
            { _id: { $in: ids }, origin },
            { $set: { verified: true } }
        );

        return { message: `${ids.length} records verified successfully` };
    }

    /**
     * Manual Correction (Admin)
     */
    async correction(data, origin) {
        const { userId, action, timestamp, remarks } = data;
        
        if (!userId || !action || !timestamp || !remarks) {
            throw new HttpError(400, "Missing required fields for correction");
        }

        const record = await this.model.create({
            user: userId,
            action,
            timestamp: new Date(timestamp),
            remarks,
            origin,
            verified: true,
            status: "Regular"
        });

        return record;
    }
}

export default new AttendanceController();
