import mongoose from "mongoose";
import { MongooseModel } from "express-web-tools";

const attendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    shift: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shift"
    },
    in: {
        time: {
            type: Date
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
        }
    },
    out: {
        time: {
            type: Date
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
        }
    },
    break: [
        {
            start: {
                type: Date
            },
            end: {
                type: Date
            },
            duration: {
                type: Number // in minutes
            }
        }
    ],
    remarks: {
        type: String
    }
});

// Indexes for performance and geospatial queries
const attendanceIndexes = [
    [
        { "in.gps": "2dsphere" }
    ],
    [
        { "out.gps": "2dsphere" }
    ],
    [
        { user: 1, origin: 1, "in.time": -1 }
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
