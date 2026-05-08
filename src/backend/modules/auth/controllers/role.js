import { CrudController } from "express-web-tools";
import { Role } from "../models/index.js";

class RoleController extends CrudController {
    constructor() {
        super(Role);
    }
}

export default new RoleController();
