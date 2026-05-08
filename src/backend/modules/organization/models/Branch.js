import mongoose from "mongoose";
import { MongooseModel } from "express-web-tools";

const Branch = new MongooseModel(
    "Branch",
    new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        address: {
            type: String
        },
        phone: {
            type: String
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
    null, // Hooks (Methods/Virtuals)
    {
        multitenant: true,
        softDelete: true,
        auditEnforce: true,
        timestamps: true
    }
).model();

export default Branch;
