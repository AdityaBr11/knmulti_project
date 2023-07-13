import { Router } from "express";
import {
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
} from "./controllers";

const policyRouter = Router();

policyRouter.get("/", controllerGet);
policyRouter.get("/:id", controllerGet);
policyRouter.post("/", controllerPost);
policyRouter.put("/:id", controllerPut);
policyRouter.delete("/:id", controllerDelete);

export default policyRouter;
