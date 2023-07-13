import { Router } from "express";
import { controllerGet, controllerPost, controllerPut } from "./controllers";

const timesheetRouter = Router();

timesheetRouter.get("/", controllerGet);
timesheetRouter.get("/:id", controllerGet);
// timesheetRouter.delete("/:id", controllerDelete);
timesheetRouter.post("/", controllerPost);
timesheetRouter.put("/:id", controllerPut);

export default timesheetRouter;
