import mongoose from "mongoose";
import { MongooseModel } from "express-web-tools";

const attendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    action: {
        type: String,
        enum: ["in", "out"],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    gps: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    gpsAccuracy: {
        type: Number
    },
    status: {
        type: String,
        enum: ["On Time", "Late In", "Early Out", "Overtime", "Regular"],
        default: "On Time"
    },
    verified: {
        type: Boolean,
        default: false
    },
    remarks: {
        type: String
    }
});

// Add 2dsphere index for geospatial queries
const attendanceIndexes = [
    [
        { gps: "2dsphere" }
    ],
    [
        { user: 1, origin: 1, timestamp: -1 }
    ]
];

const attendanceModel = new MongooseModel(
    "Attendance",
    attendanceSchema,
    attendanceIndexes,
    null, // Hooks
    {
        multitenant: true,
        softDelete: true,
        auditEnforce: true,
        timestamps: true
    }
).model();

export default attendanceModel;
