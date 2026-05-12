import mongoose from "mongoose";
import { MongooseModel } from "express-web-tools";

const holidaySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        enum: ["Public Holiday", "Company Holiday", "Personal Holiday"],
        required: true
    }
});

const holidayIndexes = [
    [
        { date: 1, origin: 1 },
        { unique: true }
    ]
];

const holidayModel = new MongooseModel(
    "Holiday",
    holidaySchema,
    holidayIndexes,
    null,
    {
        multitenant: true,
        softDelete: true,
        auditEnforce: true,
        timestamps: true
    }
).model();

export default holidayModel;
