import { HttpError } from "express-web-tools";

/**
 * Role Guard
 * Restricts access based on user role.
 * @param {...string} allowedRoles 
 */
const role = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new HttpError(401, "Authentication required"));
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(new HttpError(403, "Access denied: Insufficient permissions"));
        }

        next();
    };
};

export default role;
