import { CrudController, HttpError } from "express-web-tools";
import { User } from "../models/index.js";

class UserAccount extends CrudController {
    constructor() {
        super(User);
    }

    // User Self-Service
    async getMe(user) {
        if (!user) throw new HttpError(401, "Unauthorized");
        return user;
    }

    async updateProfile(userId, updateData) {
        // Allowed fields for self-update (logic should be handled by validation on route side)
        return await this.update(userId, updateData);
    }

    async changePassword(userId, currentPassword, newPassword) {
        if (!currentPassword || !newPassword) {
            throw new HttpError(400, "Current and new passwords are required");
        }

        const user = await this.model.findById(userId).select("+password");
        if (!user) throw new HttpError(404, "User not found");

        await user.changePassword(currentPassword, newPassword);
        return { message: "Password changed successfully" };
    }

    // Admin Actions
    async resetPassword(adminUser, userId, newPassword) {
        if (!userId || !newPassword) throw new HttpError(400, "User ID and new password are required");

        const user = await this.model.findById(userId);
        if (!user) throw new HttpError(404, "User not found");

        await user.resetPassword(adminUser, newPassword);
        return { message: "Password reset successfully" };
    }

    async updateUserDetails(userId, data) {
        return await this.update(userId, data);
    }

    async changeRole(userId, role) {
        if (!userId || !role) throw new HttpError(400, "User ID and role are required");
        return await this.update(userId, { role });
    }

    async setStatus(userId, status) {
        if (!userId || !status) throw new HttpError(400, "User ID and status are required");
        return await this.update(userId, { workStatus: status });
    }

    async activateAccount(userId) {
        return await this.activate(userId);
    }

    async deactivateAccount(userId) {
        return await this.deactivate(userId);
    }
}

export default new UserAccount();
