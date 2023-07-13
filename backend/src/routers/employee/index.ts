import { Router } from "express";
import {
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
  controllerPostActivities,
} from "./controllers";

const employeeRouter = Router();

employeeRouter.get("/", controllerGet);
employeeRouter.get("/:id", controllerGet);
employeeRouter.delete("/:id", controllerDelete);
employeeRouter.post("/", controllerPost);
employeeRouter.put("/:id", controllerPut);
employeeRouter.post("/:id/activity", controllerPostActivities);

export default employeeRouter;
