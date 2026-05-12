import { CrudRoutes } from "express-web-tools"
import holidayController from "../controllers/holiday.js";
import { auth as authGuard, permission as permissionGuard } from "../../auth/guards/index.js";

const middleware = {
    global: [authGuard],
    list: [permissionGuard("leaves", "settings", "view")],
    add: [permissionGuard("leaves", "settings", "manage")],
    read: [permissionGuard("leaves", "settings", "view")],
    update: [permissionGuard("leaves", "settings", "manage")],
    delete: [permissionGuard("leaves", "settings", "manage")]
};

const routes = new CrudRoutes("/holiday", holidayController, middleware);

export default routes.publish();
