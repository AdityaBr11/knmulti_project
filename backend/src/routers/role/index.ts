import { Router } from "express";
import {
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
} from "./controller";

const roleRouter = Router();

roleRouter.get("/", controllerGet);
roleRouter.get("/:id", controllerGet);
roleRouter.delete("/:id", controllerDelete);
roleRouter.post("/", controllerPost);
roleRouter.put("/:id", controllerPut);

export default roleRouter;
