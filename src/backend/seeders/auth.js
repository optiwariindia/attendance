import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User, Role, Permission } from "../modules/auth/models/index.js";

const origin = "frequentresearch";

export const seedAuth = async () => {
    console.log("🌱 Seeding Auth Module...");

    const UserModel = User;
    const RoleModel = Role;
    const PermissionModel = Permission;

    // 1. Seed Permissions
    const permissions = [
        // Admin Permissions (Full access)
        { authorization: "role: admin", module: "attendance", feature: "tracking", action: ["view", "clock", "manage", "verify"], origin },
        { authorization: "role: admin", module: "leaves", feature: "requests", action: ["apply", "approve", "view", "manage"], origin },
        { authorization: "role: admin", module: "organization", feature: "structure", action: ["view", "manage"], origin },
        { authorization: "role: admin", module: "users", feature: "profiles", action: ["view", "manage", "ess"], origin },
        { authorization: "role: admin", module: "config", feature: "policies", action: ["view", "manage"], origin },

        // User Permissions (Restricted access)
        { authorization: "role: user", module: "attendance", feature: "tracking", action: ["view", "clock"], origin },
        { authorization: "role: user", module: "leaves", feature: "requests", action: ["apply", "view"], origin },
        { authorization: "role: user", module: "users", feature: "profiles", action: ["view", "ess"], origin }
    ];

    for (const p of permissions) {
        await PermissionModel.findOneAndUpdate(
            { authorization: p.authorization, module: p.module, feature: p.feature, origin: p.origin },
            p,
            { upsert: true, returnDocument: 'after' }
        );
    }
    console.log("✅ Permissions seeded");

    // 2. Seed Roles
    const roles = [
        { name: "admin", description: "Administrator with full access", origin },
        { name: "user", description: "Regular employee access", origin }
    ];

    for (const r of roles) {
        await RoleModel.findOneAndUpdate(
            { name: r.name, origin: r.origin },
            r,
            { upsert: true, returnDocument: 'after' }
        );
    }
    console.log("✅ Roles seeded");

    // 3. Seed Root Admin User
    const adminPassword = await bcrypt.hash("admin123", 10);
    const adminUser = {
        origin,
        employeeID: "FR001",
        name: {
            first: "Sanket",
            last: "Engineer"
        },
        email: "admin@frequentresearch.com",
        phone: ["9876543210"],
        gender: "male",
        role: "admin",
        workStatus: "Permanent",
        password: adminPassword
    };

    // We use password in upsert only if user doesn't exist to avoid overwriting existing password on seed
    const existingUser = await UserModel.findOne({ email: adminUser.email, origin });
    if (!existingUser) {
        await UserModel.create(adminUser);
        console.log("✅ Admin user created (Pass: admin123)");
    } else {
        console.log("ℹ️ Admin user already exists");
    }

    console.log("✨ Auth seeding completed!");
};
