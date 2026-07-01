import { CrudController } from "express-web-tools";

import { LeaveApplication, LeaveCategory } from "../models/index.js";
import eventStream from "../../../core/events.js";

class LeaveApplicationController extends CrudController {
    async create(input) {
        console.log(input)
        let category = await LeaveCategory.findOne({
            shortCode: input.type,
            ...this.commonFilters
        }).lean()

        let newApplication = {
            user: this.request.user._id,
            categorySnapshot: category,
            from: input.period.from,
            to: input.period.to,
            duration: input.duration ?? (input.period.to - input.period.from),
            reason: input.reason,
            ...this.commonFilters
        }
        let application = new LeaveApplication(newApplication)
        await application.save();
        application = await this.read(application._id)
        eventStream.emit(`leave-applied`, { ...application });
        return application
    }
    async read(id) {
        return await this.model.findById(id).populate("user").lean();
    }
}

export default new LeaveApplicationController(LeaveApplication);