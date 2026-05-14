import mongoose from "mongoose";
import { MongooseModel } from "express-web-tools";

const leaveBalanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    leaveCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LeaveCategory",
        required: true
    },
    year: {
        type: Number,
        required: true,
        default: () => new Date().getFullYear()
    },
    entitled: {
        type: Number,
        default: 0
    },
    carriedForward: {
        type: Number,
        default: 0
    },
    used: {
        type: Number,
        default: 0
    },
    pending: {
        type: Number,
        default: 0
    },
    adjustments: [
        {
            amount: Number,
            reason: String,
            updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            updatedAt: { type: Date, default: Date.now }
        }
    ]
});

const leaveBalanceIndexes = [
    [
        { user: 1, leaveCategory: 1, year: 1, origin: 1 },
        { unique: true }
    ]
];

const leaveBalanceModel = new MongooseModel(
    "LeaveBalance",
    leaveBalanceSchema,
    leaveBalanceIndexes,
    null,
    {
        multitenant: true,
        softDelete: true,
        auditEnforce: true,
        timestamps: true
    }
).model();

export default leaveBalanceModel;
