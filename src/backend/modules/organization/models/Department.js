import mongoose from "mongoose";
import { MongooseModel } from "express-web-tools";

const Department = new MongooseModel(
    "Department",
    new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        manager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
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
    null, // Hooks
    {
        multitenant: true,
        softDelete: true,
        auditEnforce: true,
        timestamps: true
    }
).model();

export default Department;
