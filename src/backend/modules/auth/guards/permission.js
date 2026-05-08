import { HttpError, asyncHandler } from "express-web-tools";
import { Permission } from "../models/index.js";

/**
 * Permission Guard
 * Enforces PBAC (Permission-Based Access Control).
 */
const permission = (module, feature, action) => {
    return asyncHandler(async (req, res, next) => {
        if (!req.user) {
            throw new HttpError(401, "Authentication required");
        }

        // Query directly for the specific action across all applicable authorizations
        const hasPermission = await Permission.findOne({
            authorization: { $in: [`role: ${req.user.role}`, `user: ${req.user.employeeID}`] },
            module,
            feature,
            action: action,
            origin: req.user.origin,
            isActive: true,
            isDeleted: false
        });

        if (!hasPermission) {
            throw new HttpError(403, `Access denied: You do not have permission to ${action} in ${module}:${feature}`);
        }

        next();
    });
};

export default permission;
