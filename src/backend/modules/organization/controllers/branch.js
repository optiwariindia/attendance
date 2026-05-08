import { CrudController } from "express-web-tools";
import { Branch } from "../models/index.js";

class BranchController extends CrudController {
    constructor() {
        super(Branch);
    }
}

export default new BranchController();
