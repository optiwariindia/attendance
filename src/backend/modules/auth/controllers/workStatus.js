import { CrudController, HttpError } from "express-web-tools";
import { WorkStatus } from "../models/index.js";

class WorkStatusController extends CrudController {
    constructor() {
        super(WorkStatus);
    }
    async moveUp(id) {
        let current = await this.model.findById(id).lean();
        let sortOrders = {
            current: current.sortOrder,
            next: Number(current.sortOrder) + 1
        }
        let temp = await this.model.findOneAndUpdate({ sortOrder: sortOrders.next }, {
            $set: { sortOrder: sortOrders.current }
        })
        if (!temp) { throw new HttpError(401, "Invalid request"); }
        await this.model.findByIdAndUpdate(id, { $set: { sortOrder: sortOrders.next } })
    }
    async moveDown(id) {
        let current = await this.model.findById(id).lean();
        let sortOrders = {
            current: current.sortOrder,
            next: Number(current.sortOrder) - 1
        }
        let temp = await this.model.findOneAndUpdate({ sortOrder: sortOrders.next }, {
            $set: { sortOrder: sortOrders.current }
        })
        if (!temp) { throw new HttpError(401, "Invalid request"); }
        await this.model.findByIdAndUpdate(id, { $set: { sortOrder: sortOrders.next } })
    }
}

export default new WorkStatusController();
