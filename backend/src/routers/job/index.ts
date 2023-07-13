import { Router } from "express";
import {
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
} from "./controllers";

const jobRouter = Router();

jobRouter.get("/", controllerGet);
jobRouter.get("/:id", controllerGet);
jobRouter.post("/", controllerPost);
jobRouter.put("/:id", controllerPut);
jobRouter.delete("/:id", controllerDelete);

export default jobRouter;
