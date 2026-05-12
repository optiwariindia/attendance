import { CrudController } from "express-web-tools";
import { Designation } from "../models/index.js";

class DesignationController extends CrudController {
    constructor() {
        super(Designation);
    }

    async list(query = {}, populateFields = [], sort = {}, project = null) {
        console.log("Designation route")
        populateFields.push("department")
        return await super.list(
            query,
            populateFields,
            sort,
            project
        )
    }

}

export default new DesignationController();
