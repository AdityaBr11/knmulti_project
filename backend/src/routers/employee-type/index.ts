import { Router } from "express";
import {
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
} from "./controllers";

const employeeTypeRouter = Router();

employeeTypeRouter.get("/", controllerGet);
employeeTypeRouter.get("/:id", controllerGet);
employeeTypeRouter.post("/", controllerPost);
employeeTypeRouter.put("/:id", controllerPut);
employeeTypeRouter.delete("/:id", controllerDelete);

export default employeeTypeRouter;
