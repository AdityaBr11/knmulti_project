import { Router } from "express";
import { controllerGetLeaves, controllerPut } from "./controllers";

const approvalRouter = Router();

approvalRouter.get("/leaves", controllerGetLeaves);
approvalRouter.put("/:id", controllerPut as any);

export default approvalRouter;
