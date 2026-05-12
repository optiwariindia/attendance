import mongoose from "mongoose";
import { MongooseModel } from "express-web-tools";

const Role = new MongooseModel(
    "Role",
    new mongoose.Schema({
        name: {
            type: String,
            trim: true,
            lowercase: true,
            required: true
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
).model();

export default Role;
