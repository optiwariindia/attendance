import { CrudController, HttpError } from "express-web-tools";
import { User } from "../models/index.js";
import eventStream from "../../../core/events.js";

class UserAccount extends CrudController {
    constructor() {
        super(User);
    }
    async list(query = {}, populateFields= null, sort= {}, project = null) {
        populateFields="reportingTo branch shift"
        return super.list(query, populateFields, sort, project ) 
    }
    // User Self-Service
    async getMe(user) {
        if (!user) throw new HttpError(401, "Unauthorized");
        return await this.model.findById(user._id).populate("shift"); //sending updated value        
    }

    async updateProfile(userId, updateData) {
        // Allowed fields for self-update (logic should be handled by validation on route side)
        return await this.update(userId, updateData);
    }

    async finishOnboarding(userId) {
        const user = await this.model.findById(userId);
        if (!user) throw new HttpError(404, "User not found");

        // Basic validation: ensure bank details and emergency contact are present
        if (!user.bankDetails?.accountNumber || !user.bankDetails?.ifscCode) {
            throw new HttpError(400, "Please provide complete bank details.");
        }
        if (!user.emergencyContact?.phone || !user.emergencyContact?.name) {
            throw new HttpError(400, "Please provide emergency contact details.");
        }
        if (!user.nationalID || user.nationalID.length === 0) {
            throw new HttpError(400, "Please provide at least one National ID (e.g., PAN, Aadhar).");
        }

        user.onboardingStatus = "Completed";
        await user.save();
        return { message: "Onboarding completed successfully", onboardingStatus: "Completed" };
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
        const result = await this.update(userId, data);
        eventStream.emit("user.update", { 
            userId, 
            employeeID: result.employeeID, 
            origin: result.origin, 
            data: result 
        });
        return result;
    }

    async changeRole(userId, role) {
        if (!userId || !role) throw new HttpError(400, "User ID and role are required");
        const result = await this.update(userId, { role });
        eventStream.emit("user.role_change", { 
            userId, 
            employeeID: result.employeeID, 
            origin: result.origin, 
            role 
        });
        return result;
    }

    async setStatus(userId, status) {
        if (!userId || !status) throw new HttpError(400, "User ID and status are required");
        const result = await this.update(userId, { workStatus: status });
        eventStream.emit("user.status_change", { 
            userId, 
            employeeID: result.employeeID, 
            origin: result.origin, 
            status 
        });
        return result;
    }

    async activateAccount(userId) {
        return await this.activate(userId);
    }

    async deactivateAccount(userId) {
        return await this.deactivate(userId);
    }

    async create(data) {
        const result = await super.create(data);
        eventStream.emit("user.create", { 
            userId: result._id, 
            employeeID: result.employeeID, 
            origin: result.origin, 
            data: result 
        });
        return result;
    }
}

export default new UserAccount();
