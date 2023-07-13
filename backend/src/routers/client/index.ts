import { Router } from "express";
import {
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
} from "./controllers";

const clientRouter = Router();

clientRouter.get("/", controllerGet);
clientRouter.get("/:id", controllerGet);
clientRouter.delete("/:id", controllerDelete);
clientRouter.post("/", controllerPost);
clientRouter.put("/:id", controllerPut);

export default clientRouter;
