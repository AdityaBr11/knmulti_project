import { Router } from "express";
import {
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
} from "./controllers";

const goalTypeRouter = Router();

goalTypeRouter.get("/", controllerGet);
goalTypeRouter.post("/", controllerPost);
goalTypeRouter.put("/:id", controllerPut);
goalTypeRouter.delete("/", controllerDelete);

export default goalTypeRouter;
