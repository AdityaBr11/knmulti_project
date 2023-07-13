import { Router } from "express";
import {
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
} from "./controllers";

const leaveTypeRouter = Router();

leaveTypeRouter.get("/", controllerGet);
leaveTypeRouter.get("/:id", controllerGet);
leaveTypeRouter.post("/", controllerPost);
leaveTypeRouter.put("/:id", controllerPut);
leaveTypeRouter.delete("/:id", controllerDelete);

export default leaveTypeRouter;
