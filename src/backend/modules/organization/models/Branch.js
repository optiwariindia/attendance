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
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point"
            },
            coordinates: {
                type: [Number],
                default: [0, 0]
            }
        },
        radius: {
            type: Number,
            default: 200 // Default radius in meters
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
        ],
        [
            {
                location: "2dsphere"
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
