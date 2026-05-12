import { CrudController } from "express-web-tools";
import { Shift } from "../models/index.js";

class ShiftController extends CrudController {
    constructor() {
        super(Shift);
    }
}

export default new ShiftController();
