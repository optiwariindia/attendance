import { CrudController } from "express-web-tools";
import { Branch } from "../models/index.js";

class BranchController extends CrudController {
    constructor() {
        super(Branch);
    }

    async update(id, data) {
        data = this.mapData(data);
        return super.update(id, data);
    }

    async add(data) {
        data = this.mapData(data);
        return super.add(data);
    }

    async updateFirst(data, origin) {
        data = this.mapData(data);
        this.request = { origin, user: this.request?.user }; // Ensure origin is set for commonFilters
        const record = await this.model.findOneAndUpdate(
            { origin, isDeleted: false },
            data,
            { new: true, upsert: true }
        );
        return record;
    }

    mapData(data) {
        const mappedData = { ...data };

        // Map email/phone to contact
        if (mappedData.email || mappedData.phone) {
            mappedData.contact = mappedData.contact || {};
            if (mappedData.email) mappedData.contact.email = mappedData.email;
            if (mappedData.phone) mappedData.contact.phone = mappedData.phone;
            delete mappedData.email;
            delete mappedData.phone;
        }

        // Map flat address fields to nested address object
        const addressFields = ["addressLine1", "addressLine2", "city", "state", "country", "zipCode"];
        const hasFlatAddress = addressFields.some(f => mappedData[f] !== undefined);

        if (hasFlatAddress) {
            mappedData.address = mappedData.address || {};
            addressFields.forEach(f => {
                if (mappedData[f] !== undefined) {
                    mappedData.address[f] = mappedData[f];
                    delete mappedData[f];
                }
            });
        }

        return mappedData;
    }
}

export default new BranchController();
