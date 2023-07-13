import { Router } from "express";
import {
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
} from "./controllers";

const leaveRouter = Router();

leaveRouter.get("/", controllerGet as any);
leaveRouter.get("/:id", controllerGet as any);
leaveRouter.put("/:id", controllerPut as any);
leaveRouter.delete("/:id", controllerDelete as any);
leaveRouter.post("/", controllerPost as any);

export default leaveRouter;
