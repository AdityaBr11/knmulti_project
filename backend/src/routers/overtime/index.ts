import { Router } from "express";
import {
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
} from "./controllers";
const overtimeRouter = Router();

overtimeRouter.get("/", controllerGet);
overtimeRouter.get("/:id", controllerGet);
overtimeRouter.post("/", controllerPost);
overtimeRouter.put("/:id", controllerPut);
overtimeRouter.delete("/:id", controllerDelete);

export default overtimeRouter;
