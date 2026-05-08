import { CrudController } from "express-web-tools";
import { Department } from "../models/index.js";

class DepartmentController extends CrudController {
    constructor() {
        super(Department);
    }
}

export default new DepartmentController();
