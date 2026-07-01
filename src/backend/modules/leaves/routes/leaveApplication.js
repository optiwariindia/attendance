import { CrudRoutes } from "express-web-tools";
import leaveApplicationController from "../controllers/leaveApplication.js";
import { auth as authGuard, permission as permissionGuard } from "../../auth/guards/index.js";

const middleware = {
    global: [authGuard],
    list: [permissionGuard("leaves", "application", "view")],
    add: [permissionGuard("leaves", "application", "apply")],
    read: [permissionGuard("leaves", "application", "view")],
    update: [permissionGuard("leaves", "application", "manage")],
    delete: [permissionGuard("leaves", "application", "manage")]
};

const routes = new CrudRoutes("/application", leaveApplicationController, middleware);

export default routes.publish();