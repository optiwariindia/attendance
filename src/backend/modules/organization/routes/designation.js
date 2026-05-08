import { CrudRoutes } from "express-web-tools";
import designationController from "../controllers/designation.js";
import { auth as authGuard, permission as permissionGuard } from "../../auth/guards/index.js";

const middleware = {
    global: [authGuard],
    list: [permissionGuard("organization", "structure", "view")],
    add: [permissionGuard("organization", "structure", "manage")],
    read: [permissionGuard("organization", "structure", "view")],
    update: [permissionGuard("organization", "structure", "manage")],
    delete: [permissionGuard("organization", "structure", "manage")]
};

const routes = new CrudRoutes("designations", designationController, middleware);

export default routes.publish();
