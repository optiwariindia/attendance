import { CrudRoutes } from "express-web-tools";
import permissionController from "../controllers/permission.js";
import { auth as authGuard, permission as permissionGuard } from "../guards/index.js";

const middleware = {
    global: [authGuard],
    list: [permissionGuard("config", "policies", "view")],
    add: [permissionGuard("config", "policies", "manage")],
    read: [permissionGuard("config", "policies", "view")],
    update: [permissionGuard("config", "policies", "manage")],
    delete: [permissionGuard("config", "policies", "manage")]
};

const routes = new CrudRoutes("permissions", permissionController, middleware);

export default routes.publish();
