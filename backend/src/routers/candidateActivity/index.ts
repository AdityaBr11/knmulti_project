import { Router } from "express";
import {
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
} from "./controllers";

const categoryRouter = Router();

categoryRouter.get("/", controllerGet);
categoryRouter.get("/:id", controllerGet);
categoryRouter.post("/", controllerPost);
categoryRouter.put("/:id", controllerPut);
categoryRouter.delete("/:id", controllerDelete);

export default categoryRouter;
