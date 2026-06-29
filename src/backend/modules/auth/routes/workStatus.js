import { CrudRoutes } from "express-web-tools";
import workStatusController from "../controllers/workStatus.js";
import { auth as authGuard, permission as permissionGuard } from "../guards/index.js";

const middleware = {
    global: [authGuard],
    list: [permissionGuard("config", "policies", "view")],
    add: [permissionGuard("config", "policies", "manage")],
    read: [permissionGuard("config", "policies", "view")],
    update: [permissionGuard("config", "policies", "manage")],
    delete: [permissionGuard("config", "policies", "manage")]
};

const routes = new CrudRoutes("/work-status", workStatusController, middleware);

export default routes.publish();
