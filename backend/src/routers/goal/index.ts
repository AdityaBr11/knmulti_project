import { Router } from "express";
import {
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
} from "./controllers";

const goalRouter = Router();

goalRouter.get("/", controllerGet);
goalRouter.get("/:id", controllerGet);
goalRouter.post("/", controllerPost);
goalRouter.put("/:id", controllerPut);
goalRouter.delete("/:id", controllerDelete);

export default goalRouter;
