import { Router } from "express";
import {
  controllerGet,
  controllerDelete,
  controllerPost,
  controllerPut,
} from "./tasks";

const taskRouter = Router();

taskRouter.get("/", controllerGet);
taskRouter.delete("/", controllerDelete);
taskRouter.post("/", controllerPost);
taskRouter.put("/", controllerPut);

export default taskRouter;
