import {CrudRoutes} from "express-web-tools"
import shiftController from "../controllers/shift.js";
import { auth as authGuard, permission as permissionGuard } from "../../auth/guards/index.js";

const middleware = {
    global: [authGuard],
    list: [permissionGuard("attendance", "settings", "view")],
    add: [permissionGuard("attendance", "settings", "manage")],
    read: [permissionGuard("attendance", "settings", "view")],
    update: [permissionGuard("attendance", "settings", "manage")],
    delete: [permissionGuard("attendance", "settings", "manage")]
};

const routes = new CrudRoutes("/shift", shiftController, middleware);

export default routes.publish();
