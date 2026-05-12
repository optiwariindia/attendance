import mongoose from "mongoose";
import { MongooseModel } from "express-web-tools";

const shiftSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    startTime: {
        type: String, // e.g., "09:00"
        required: true
    },
    endTime: {
        type: String, // e.g., "18:00"
        required: true
    },
    breakDuration: {
        type: Number, // in minutes
        default: 0
    },
    overtimeRules: {
        type: mongoose.Schema.Types.Mixed
    },
    shiftDuration: {
        type: Number // in minutes
    },
    gracePeriod: {
        in: { type: Number, default: 0 },
        out: { type: Number, default: 0 }
    },
    presence: {
        gross: { type: Number },
        net: { type: Number },
        minimumHours: { type: Number }
    }
});

const shiftIndexes = [
    [
        { name: 1, origin: 1 },
        { unique: true }
    ]
];

const shiftModel = new MongooseModel(
    "Shift",
    shiftSchema,
    shiftIndexes,
    null,
    {
        multitenant: true,
        softDelete: true,
        auditEnforce: true,
        timestamps: true
    }
).model();

export default shiftModel;
