import mongoose from "mongoose";
import { MongooseModel } from "express-web-tools";

const Designation = new MongooseModel(
    "Designation",
    new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        priority: {
            type: Number,
            default: 0
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

export default Designation;
