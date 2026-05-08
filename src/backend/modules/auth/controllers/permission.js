import { CrudController } from "express-web-tools";
import { Permission } from "../models/index.js";

class PermissionController extends CrudController {
    constructor() {
        super(Permission);
    }
}

export default new PermissionController();
