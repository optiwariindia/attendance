import mongoose from "mongoose";
import { MongooseModel } from "express-web-tools";

const leaveCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    shortCode: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    color: {
        type: String,
        default: "#0c5adb"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    sortOrder: {
        type: Number,
        default: 0
    },
    isPaid: {
        type: Boolean,
        default: true
    },
    requestDeadline:{
        type:Number,
        default:0 // application is not accepted after this number of days
    },
    requiresApproval: {
        type: Boolean,
        default: true
    },
    allowHalfDay: {
        type: Boolean,
        default: true
    },
    allowNegativeBalance: {
        type: Boolean,
        default: false
    },
    allowedInProbation: {
        type: Boolean,
        default: true
    },
    attachmentRequired: {
        type: Boolean,
        default: false
    },
    eligibilityInterval: {
        type: Number, // e.g., 1 leave for every X months
        default: 1
    },
    annualQuota: {
        type: Number,
        default: 12
    },
    isCarryForward: {
        type: Boolean,
        default: false
    },
    applicationFormat: [
        {
            label: String,
            fieldType: { type: String, enum: ["text", "number", "date", "select", "checkbox"] },
            required: Boolean,
            options: [String] // For select types
        }
    ]
});

const leaveCategoryIndexes = [
    [
        { name: 1, origin: 1 },
        { unique: true }
    ],
    [
        { shortCode: 1, origin: 1 },
        { unique: true }
    ]
];

const leaveCategoryModel = new MongooseModel(
    "LeaveCategory",
    leaveCategorySchema,
    leaveCategoryIndexes,
    null,
    {
        multitenant: true,
        softDelete: true,
        auditEnforce: true,
        timestamps: true
    }
).model();

export default leaveCategoryModel;
