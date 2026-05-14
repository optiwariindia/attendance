import { CrudController, HttpError } from "express-web-tools";
import mongoose from "mongoose";
import { Attendance, Shift } from "../models/index.js";
import User from "../../auth/models/User.js";
import eventStream from "../../../core/events.js";

// import "../events/generateDailyEntries.js";

class AttendanceController extends CrudController {
    constructor() {
        super(Attendance);
    }
    async list(query = {}, populateFields = null, sort = {}, project = null) {
        populateFields = "shift"
        return super.list(query, populateFields, sort, project)
    }

    async getReport(userId, year, month) {
        const user = await User.findById(userId).populate("shift branch");
        if (!user) throw new HttpError(404, "User not found");

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const startStr = startDate.toISOString().split("T")[0];
        const endStr = endDate.toISOString().split("T")[0];

        const [attendanceRecords, holidays] = await Promise.all([
            this.model.find({
                user: userId,
                date: { $gte: startStr, $lte: endStr },
                isDeleted: false
            }).populate("shift"),
            mongoose.model("Holiday").find({
                date: { $gte: startDate, $lte: endDate },
                isDeleted: false
            })
        ]);

        const attendanceMap = new Map(attendanceRecords.map(r => [r.date, r]));
        const holidayMap = new Map(holidays.map(h => [h.date.toISOString().split("T")[0], h]));

        const report = {
            employee: {
                id: user.employeeID,
                name: `${user.name.first} ${user.name.last}`,
                branch: user.branch?.name || "N/A",
                shift: user.shift ? {
                    name: user.shift.name,
                    inTime: user.shift.startTime,
                    outTime: user.shift.endTime,
                    lateGraceMinutes: user.shift.gracePeriod?.in || 0,
                    earlyLeaveGraceMinutes: user.shift.gracePeriod?.out || 0
                } : null,
                weeklyOff: user.workPolicy?.weeklyOff || [0]
            },
            summary: {
                month: `${year}-${String(month).padStart(2, '0')}`,
                present: 0,
                absent: 0,
                late: 0,
                early: 0,
                leave: 0,
                weeklyOff: 0,
                holiday: 0,
                totalWorkingHours: 0,
                totalBreakMinutes: 0
            },
            attendance: []
        };

        const timeToMinutes = (t) => {
            if (!t) return 0;
            const [h, m] = t.split(":").map(Number);
            return h * 60 + m;
        };

        const dateTimeToMinutes = (d) => {
            if (!d) return 0;
            const date = new Date(d);
            return date.getHours() * 60 + date.getMinutes();
        };

        const formatDate = (date) => {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        };

        const getSafeDuration = (d, grossMins) => {
            if (!d) return 0;
            // Heuristic: If duration is > 1440 (minutes in a day) OR 
            // if it's larger than the entire gross day, it's definitely milliseconds.
            if (d > 1440 || d > grossMins) {
                return Math.round(d / 60000);
            }
            return d;
        };

        const todayStr = formatDate(new Date());

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = formatDate(d);
            const record = attendanceMap.get(dateStr);
            const holiday = holidayMap.get(dateStr);
            const isWeeklyOff = report.employee.weeklyOff.includes(d.getDay());
            
            // If no record exists for this day, we only show it if it's a FUTURE holiday or weekly-off
            if (!record && !(dateStr > todayStr && (holiday || isWeeklyOff))) continue;

            const isOffDay = !!record?.dayContext || (isWeeklyOff || !!holiday);
            let dayEntries = [];

            // 1. Process Day Context (Prioritize record.dayContext for past/present, otherwise live data for future)
            if (isOffDay) {
                const ctx = record?.dayContext || {
                    type: holiday ? "holiday" : (isWeeklyOff ? "weekly-off" : null),
                    name: holiday ? holiday.name : (isWeeklyOff ? "Weekly Off" : null)
                };

                if (ctx.type) {
                    const statusMap = {
                        "weekly-off": { status: "WEEKLY_OFF", color: "#2196f3", title: "Weekly Off" },
                        "holiday": { status: "HOLIDAY", color: "#d81b60", title: ctx.name || "Holiday" },
                        "leave": { status: "LEAVE", color: "#9c27b0", title: ctx.name || "Leave" }
                    };
                    
                    const meta = statusMap[ctx.type] || { status: "OTHER", color: "#9e9e9e", title: ctx.name || "Off Day" };
                    
                    dayEntries.push({
                        date: dateStr,
                        status: meta.status,
                        title: meta.title,
                        color: meta.color
                    });

                    // Update Summary
                    if (ctx.type === "weekly-off") report.summary.weeklyOff++;
                    else if (ctx.type === "holiday") report.summary.holiday++;
                    else if (ctx.type === "leave") report.summary.leave++;
                }
            }

            // 2. Process Attendance (Punches)
            if (record?.in?.time) {
                const shift = record.shift || user.shift;
                let dayData = {
                    date: dateStr,
                    status: "PRESENT",
                    color: "#4caf50",
                    title: "Present",
                    inTime: new Date(record.in.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                    outTime: record.out?.time ? new Date(record.out.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : null
                };

                const inMins = dateTimeToMinutes(record.in.time);
                const shiftInMins = timeToMinutes(shift?.startTime);
                
                if (shift) {
                    const lateGrace = shift.gracePeriod?.in || 0;
                    if (inMins > shiftInMins + lateGrace) {
                        dayData.status = "LATE";
                        dayData.lateMinutes = inMins - shiftInMins;
                        dayData.title = `Late ${dayData.lateMinutes}m`;
                        dayData.color = "#ff9800";
                        report.summary.late++;
                    }

                    if (record.out?.time) {
                        const outMins = dateTimeToMinutes(record.out.time);
                        const shiftOutMins = timeToMinutes(shift?.endTime);
                        const earlyGrace = shift.gracePeriod?.out || 0;

                        if (outMins < shiftOutMins - earlyGrace) {
                            dayData.status = "EARLY";
                            dayData.earlyMinutes = shiftOutMins - outMins;
                            dayData.title = `Left Early ${dayData.earlyMinutes}m`;
                            dayData.color = "#fbc02d";
                            report.summary.early++;
                        }
                    }
                }

                if (record.out?.time) {
                    if (dayData.status === "PRESENT") report.summary.present++;
                    
                    const diffMs = new Date(record.out.time) - new Date(record.in.time);
                    const gross = Math.round(diffMs / 60000);
                    const breakMins = record.break.reduce((acc, b) => acc + getSafeDuration(b.duration, gross), 0);
                    
                    dayData.grossMinutes = gross;
                    dayData.breakMinutes = breakMins;
                    dayData.netMinutes = Math.max(0, gross - breakMins);
                    dayData.title = `${dayData.inTime} → ${dayData.outTime}`;

                    report.summary.totalNetMinutes += dayData.netMinutes;
                    report.summary.totalBreakMinutes += breakMins;
                } else if (dateStr === todayStr) {
                    dayData.status = "IN_OFFICE";
                    dayData.title = "In Office";
                    dayData.color = "#4caf50";
                } else {
                    dayData.status = "MISSING_OUT";
                    dayData.title = "Missing OUT";
                    dayData.color = "#212121";
                }

                // If working on an off-day, indicate Comp-Off candidate
                if (isOffDay) {
                    dayData.title += " (Comp-Off Candidate)";
                    dayData.isCompOffCandidate = true;
                }

                dayEntries.push(dayData);
            } else if (!isOffDay) {
                // No punch and not an off-day
                if (dateStr === todayStr) {
                    dayEntries.push({
                        date: dateStr,
                        status: "AWAITED",
                        title: "Awaited",
                        color: "#9e9e9e"
                    });
                } else if (dateStr < todayStr) {
                    dayEntries.push({
                        date: dateStr,
                        status: "ABSENT",
                        title: "Absent",
                        color: "#f44336"
                    });
                    report.summary.absent++;
                }
            }

            if (dayEntries.length > 0) {
                report.attendance.push(...dayEntries);
            }
        }

        return report;
    }
    async clock(today, action, gps) {
        if (!["in", "out"].includes(action)) {
            throw new HttpError(400, "Invalid action type");
        }
        let attendance = await super.findOne({
            user: this.request.user._id,
            date: today,
            origin: this.request.origin,
            isActive: true,
            isDeleted: false
        })
        if (!attendance) throw new HttpError(403, "Permission denied");
        switch (action) {
            case "in":
                if (!attendance.in.time) {
                    attendance.in.time = new Date();
                    attendance.in.gps = gps;
                    attendance.in.gpsAccuracy = gps?.accuracy
                    break;
                }
                if(!attendance.out.time){
                    throw new HttpError(402,"Duplicate entry, mark out first");
                }
                attendance.break.push({
                    start: attendance.out.time,
                    end: new Date(),
                    duration: Math.round((new Date() - new Date(attendance.out.time)) / (1000 * 60))
                });
                attendance.out.time=null;
                // todo: Add break policy
                break;
            case "out":
                if (!attendance.out.time)
                    attendance.out.time = new Date();
                attendance.out.gps = gps;
                attendance.out.gpsAccuracy = gps?.accuracy

            default:
                break;
        }
        await attendance.save();
        eventStream.emit(`marked-${action}`, { ...this.request.user, attendance });
    }
    // todo: generate attendance entry for all employees with start of the day.

    /*
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
        //*/
}

export default new AttendanceController();
