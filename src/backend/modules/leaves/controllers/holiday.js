import { CrudController } from "express-web-tools";
import { Holiday } from "../models/index.js";

class HolidayController extends CrudController {
    constructor() {
        super(Holiday);
    }
}

export default new HolidayController();
