import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { MongooseModel } from "express-web-tools";

const userSchema = new mongoose.Schema({
    employeeID: {
        type: String
    },
    name: {
        first: {
            type: String,
            required: true,
        },
        middle: {
            type: String,
            default: ""
        },
        last: {
            type: String,
            required: true,
        }
    },
    email: {
        type: String,
        required: true
    },
    phone: [{
        type: String,
        required: true
    }],
    gender: {
        type: String,
        required: true,
        enum: ["male", "female", "other"]
    },
    dob: {
        type: Date
    },
    doj: {
        type: Date
    },
    nationalID: [
        {
            idName: String,
            idNumber: String
        }
    ],
    workStatus: {
        type: String,
        enum: [
            "Draft",
            "Probation",
            "Permanent",
            "Terminated",
            "Abscond",
            "Resigned"
        ]
    },
    department: {
        type: String
    },
    designation: {
        type: String
    },
    password: { type: String, select: false },
    role: { type: String, trim: true, lowercase: true, default: "user" },
    profilePicture: { type: String },
    sortOrder: { type: Number, default: 0 },
    timezone: {
        type: String,
        default: "Asia/Kolkata"
    },
    workPolicy: {
        allowOutsideLogin: { type: Boolean, default: false },
        isWFH: { type: Boolean, default: false },
        weeklyOff: { type: [Number], default: [0] } // 0: Sunday, 1: Monday, etc.
    },
    shift: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shift"
    },
    reportingTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch"
    },
    routing: {
        leave: {
            to: [{ type: String }],
            cc: [{ type: String }],
            bcc: [{ type: String }]
        },
        finance: {
            to: [{ type: String }],
            cc: [{ type: String }],
            bcc: [{ type: String }]
        },
        it: {
            to: [{ type: String }],
            cc: [{ type: String }],
            bcc: [{ type: String }]
        }
    },
    bankDetails: {
        accountName: String,
        accountNumber: String,
        bankName: String,
        ifscCode: String,
        branchName: String
    },
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String
    },
    onboardingStatus: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending"
    }
});

const userIndexes = [
    [
        {
            email: 1,
            origin: 1
        },
        {
            unique: 1
        }
    ],
    [
        {
            employeeID: 1,
            origin: 1
        },
        {
            unique: 1
        }
    ]
];

const userHooks = {
    method: {
        verifyPassword: async function (password) {
            const user = await this.constructor.findById(this._id).select("+password");
            if (!user || !user.password) throw new Error("Account is inactive");
            return await bcrypt.compare(password, user.password);
        },
        resetPassword: async function (admin, password) {
            if (!admin || !admin.role || !["admin", "superadmin", "root"].includes(admin.role)) throw new Error("Permission denied");
            this.password = await bcrypt.hash(password, 10);
            await this.save();
            return this;
        },
        changePassword: async function (currentPassword, newPassword) {
            const user = await this.constructor.findById(this._id).select("+password");
            if (!(await bcrypt.compare(currentPassword, user.password))) throw new Error("Current password invalid. Check your password and try again.");
            this.password = await bcrypt.hash(newPassword, 10);
            await this.save();
            return this;
        }
    },
    virtuals: {
        fullName: function () {
            return [this.name.first, this.name.middle, this.name.last]
                .filter(Boolean)
                .join(" ");
        },
        age: function () {
            if (!this.dob) return null;
            const today = new Date();
            const dob = new Date(this.dob);
            let temp = {
                years: today.getFullYear() - dob.getFullYear(),
                month: today.getMonth() - dob.getMonth(),
                day: today.getDate() - dob.getDate()
            };
            if (temp.day < 0) {
                temp.month = temp.month - 1;
                temp.day += 30;
            }
            if (temp.month < 0) {
                temp.years = temp.years - 1;
                temp.month += 12;
            }
            return temp;
        }
    }
};

// MongooseModel(name, schema, indexes, hooks, config)
const userModel = new MongooseModel(
    "User",
    userSchema,
    userIndexes,
    userHooks,
    {
        multitenant: true,
        softDelete: true,
        auditEnforce: true,
        timestamps: true
    }
).model();

export default userModel;
