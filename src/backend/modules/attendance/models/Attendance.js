import mongoose from "mongoose";
import { MongooseModel } from "express-web-tools";

const attendanceSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{4}-\d{2}-\d{2}$/.test(v)
            },
            message: props =>
                `${props.value} is not a valid date format (YYYY-MM-DD)`
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    shift: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shift",
        required: true
    },
    in: {
        time: {
            type: Date,
            default: null
        },
        gps: {
            type: {
                type: String,
                enum: ["Point"]
            },
            coordinates: {
                type: [Number]
            }
        },
        gpsAccuracy: {
            type: Number
        }
    },
    out: {
        time: {
            type: Date,
            default: null
        },
        gps: {
            type: {
                type: String,
                enum: ["Point"]
            },
            coordinates: {
                type: [Number]
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
    },
    dayContext: {
        type: {
            type: String,
            enum: ["weekly-off", "leave", "holiday"]
        },
        name: String,
        remarks: String
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
    ],
    [
        { user: 1, origin: 1, date: 1 }, { unique: true }
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
