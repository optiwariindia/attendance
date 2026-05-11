import jwt from "jsonwebtoken";
import { HttpError, CrudController } from "express-web-tools";
import { User } from "../models/index.js";
import eventStream from "../../../core/events.js";

class Auth extends CrudController {
    constructor() {
        super(User);
    }

    async login(username, password, origin) {
        if (!username || !password) {
            throw new HttpError(400, "Username and password are required");
        }

        const user = await User.findOne({
            $or: [{ email: username }, { employeeID: username }],
            origin,
            isDeleted: false
        });

        if (!user) {
            throw new HttpError(401, "Invalid credentials");
        }

        const isMatch = await user.verifyPassword(password);
        if (!isMatch) {
            throw new HttpError(401, "Invalid credentials");
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, origin: user.origin },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const userData = {
            id: user._id,
            employeeID: user.employeeID,
            name: user.fullName,
            role: user.role,
            tenantID: user.origin
        };

        // Emit login event
        eventStream.emit("auth.login", { 
            userId: user._id, 
            employeeID: user.employeeID, 
            origin, 
            user: userData 
        });

        return {
            token,
            user: userData
        };
    }

    async register(companyName, adminEmail, adminPassword, domain) {
        if (!companyName || !adminEmail || !adminPassword || !domain) {
            throw new HttpError(400, "All fields are required");
        }

        const existingUser = await User.findOne({ email: adminEmail, origin: domain });
        if (existingUser) {
            throw new HttpError(400, "User with this email already exists for this domain");
        }

        const newUser = await User.create({
            origin: domain,
            email: adminEmail,
            password: adminPassword,
            name: { first: "Admin", last: companyName },
            role: "admin",
            gender: "other",
            workStatus: "Permanent"
        });

        // Emit registration event
        eventStream.emit("auth.register", {
            userId: newUser._id,
            employeeID: newUser.employeeID,
            origin: domain,
            email: adminEmail,
            companyName
        });

        return {
            message: "Company registered successfully",
            data: {
                id: newUser._id,
                email: newUser.email,
                origin: newUser.origin
            }
        };
    }

    async logout(user, origin) {
        // Emit logout event
        if (user && origin) {
            eventStream.emit("auth.logout", { 
                userId: user._id, 
                employeeID: user.employeeID, 
                origin 
            });
        }
        return { message: "Logged out successfully" };
    }

    async forgotPassword(email) {
        // TODO: Implement email service
        return { message: "If your email is registered, you will receive a reset link shortly." };
    }
}

export default new Auth();
