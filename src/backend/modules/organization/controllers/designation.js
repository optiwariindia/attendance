import { CrudController } from "express-web-tools";
import { Designation } from "../models/index.js";

class DesignationController extends CrudController {
    constructor() {
        super(Designation);
    }
}

export default new DesignationController();
