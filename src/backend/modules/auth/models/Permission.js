import mongoose from "mongoose";
import { MongooseModel } from "express-web-tools";

const Permission = new MongooseModel(
    "Permission",
    new mongoose.Schema({
        authorization: {
            type: String,
            required: true
        },
        module: {
            type: String,
            required: true
        },
        feature: {
            type: String,
            required: true
        },
        action: [
            {
                type: String,
                required: true
            }
        ]
    }),
    null, // Indexes
    null, // Methods
    null, // Virtuals
    {
        multitenant: true,
        softDelete: true,
        auditEnforce: true,
        timestamps: true
    }
);

export default Permission.model();
