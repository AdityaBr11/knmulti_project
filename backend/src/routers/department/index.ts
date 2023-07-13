import { Router } from "express";
import {
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
} from "./controllers";

const departmentRouter = Router();

departmentRouter.get("/", controllerGet);
departmentRouter.get("/:id", controllerGet);
departmentRouter.post("/", controllerPost);
departmentRouter.put("/:id", controllerPut);
departmentRouter.delete("/:id", controllerDelete);

export default departmentRouter;
