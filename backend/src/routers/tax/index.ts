import { Router } from "express";
import {
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
} from "./controllers";

const taxRouter = Router();

taxRouter.get("/", controllerGet);
taxRouter.get("/:id", controllerGet);
taxRouter.post("/", controllerPost);
taxRouter.put("/:id", controllerPut);
taxRouter.delete("/:id", controllerDelete);

export default taxRouter;
