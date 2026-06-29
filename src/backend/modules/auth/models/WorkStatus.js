import mongoose from "mongoose";
import { MongooseModel } from "express-web-tools";

const WorkStatus = new MongooseModel(
    "WorkStatus",
    new mongoose.Schema({
        name: {
            type: String,
            trim: true,
            lowercase: true,
            required: true
        },
        canMarkAttendance: {
            type: Boolean,
            default: false
        },
        description: {
            type: String,
        }
    }),
    [
        [
            {
                name: 1,
                origin: 1
            },
            {
                unique: true
            }
        ]
    ],
    null, // Methods
    null, // Virtuals
    {
        multitenant: true,
        softDelete: true,
        auditEnforce: true,
        timestamps: true
    }
)
export default WorkStatus.model();