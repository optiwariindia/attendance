import { Branch, Department, Designation } from "../modules/organization/models/index.js";

const origin = "frequentresearch";

export const seedOrganization = async () => {
    console.log("🏢 Seeding Organization Module...");

    // 1. Seed Branches
    const branches = [
        { name: "Head Office", address: "Mumbai, Maharashtra", phone: "022-12345678", origin }
    ];

    for (const b of branches) {
        await Branch.findOneAndUpdate(
            { name: b.name, origin: b.origin },
            b,
            { upsert: true, returnDocument: 'after' }
        );
    }
    console.log("✅ Branches seeded");

    // 2. Seed Departments
    const departments = [
        { name: "Engineering", description: "Software development and infrastructure", origin },
        { name: "Human Resources", description: "People operations and recruitment", origin },
        { name: "Operations", description: "Fieldwork and daily operations", origin }
    ];

    for (const d of departments) {
        await Department.findOneAndUpdate(
            { name: d.name, origin: d.origin },
            d,
            { upsert: true, returnDocument: 'after' }
        );
    }
    console.log("✅ Departments seeded");

    // 3. Seed Designations
    const designations = [
        { name: "Lead Engineer", priority: 1, origin },
        { name: "Software Engineer", priority: 2, origin },
        { name: "HR Manager", priority: 1, origin },
        { name: "Field Researcher", priority: 3, origin }
    ];

    for (const des of designations) {
        await Designation.findOneAndUpdate(
            { name: des.name, origin: des.origin },
            des,
            { upsert: true, returnDocument: 'after' }
        );
    }
    console.log("✅ Designations seeded");

    console.log("✨ Organization seeding completed!");
};
