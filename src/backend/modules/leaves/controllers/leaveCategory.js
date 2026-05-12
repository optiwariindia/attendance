import { CrudController } from "express-web-tools";
import { LeaveCategory } from "../models/index.js";

class LeaveCategoryController extends CrudController {
    constructor() {
        super(LeaveCategory);
    }
}

export default new LeaveCategoryController();
