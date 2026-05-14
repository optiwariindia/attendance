import mongoose from "mongoose";
import { MongooseModel } from "express-web-tools";

const leaveApplicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // Snapshot of the category at the time of application
    categorySnapshot: {
        _id: mongoose.Schema.Types.ObjectId,
        name: String,
        shortCode: String,
        isPaid: Boolean,
        requiresApproval: Boolean,
        allowHalfDay: Boolean,
        color: String
    },
    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, // In days
        required: true
    },
    type: {
        type: String,
        enum: ["Full Day", "Half Day - First Half", "Half Day - Second Half"],
        default: "Full Day"
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected", "Cancelled"],
        default: "Pending"
    },
    approvalChain: [
        {
            approver: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            level: Number, // 1 for immediate manager, 2 for HR, etc.
            status: {
                type: String,
                enum: ["Pending", "Approved", "Rejected"],
                default: "Pending"
            },
            remarks: String,
            updatedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    attachments: [String], 
    additionalData: {
        type: mongoose.Schema.Types.Mixed
    },
    appliedOn: {
        type: Date,
        default: Date.now
    }
});

const leaveApplicationIndexes = [
    [
        { user: 1, origin: 1, from: -1 }
    ],
    [
        { status: 1, origin: 1 }
    ]
];

const leaveApplicationModel = new MongooseModel(
    "LeaveApplication",
    leaveApplicationSchema,
    leaveApplicationIndexes,
    null,
    {
        multitenant: true,
        softDelete: true,
        auditEnforce: true,
        timestamps: true
    }
).model();

export default leaveApplicationModel;
