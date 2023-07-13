import { Router } from "express";
import {
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
} from "./controllers";

const employeeTaskRouter = Router();

employeeTaskRouter.get("/", controllerGet);
employeeTaskRouter.post("/", controllerPost);
employeeTaskRouter.put("/:id", controllerPut);
employeeTaskRouter.delete("/", controllerDelete);

export default employeeTaskRouter;
