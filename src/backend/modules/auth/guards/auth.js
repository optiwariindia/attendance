import jwt from "jsonwebtoken";
import { HttpError, asyncHandler } from "express-web-tools";
import { User } from "../models/index.js";
import shiftModel from "../../attendance/models/Shift.js";

/**
 * Auth Guard
 * Verifies JWT and populates req.user.
 */
const auth = asyncHandler(async (req, res, next) => {
    let authString = req.cookies?.authorization;
    if (!authString) {
        authString = req.headers.authorization;
    }

    if (!authString || !authString.startsWith("Bearer ")) {
        throw new HttpError(401, "Authentication required");
    }

    const token = authString.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || ["Terminated", "Abscond"].includes(user.workStatus)) {
        throw new HttpError(401, "User not found or account inactive");
    }

    // Multi-tenant isolation check
    if (user.origin !== req.origin) {
        throw new HttpError(403, "Access denied: Domain mismatch");
    }
    if("shift" in user){
        let shift=await shiftModel.findById(user.shift);
    }
    req.user = user;
    next();
});

export default auth;
