import attendanceController from "../controllers/attendance.js";

/**
 * Setup Midnight Routine for Attendance
 */
const initMidnightEntryGeneration = () => {
    console.log("[Attendance Event] Midnight routine initialized.");
    
    setInterval(() => {
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            console.log("[Attendance Event] Triggering midnight attendance generation...");
            attendanceController.generateDailyEntries("system-internal");
        }
    }, 60000); // Check every minute
};

// Start the interval
initMidnightEntryGeneration();
