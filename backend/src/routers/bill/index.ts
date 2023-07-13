import { Router } from "express";
import {
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
} from "./controllers";

const billRouter = Router();

billRouter.get("/", controllerGet);
billRouter.get("/:id", controllerGet);
billRouter.post("/", controllerPost as any);
billRouter.delete("/:id", controllerDelete);
billRouter.put("/:id", controllerPut as any);

export default billRouter;
