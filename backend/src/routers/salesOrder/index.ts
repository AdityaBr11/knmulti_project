import { Router } from "express";
import {
  controllerPost,
  controllerGet,
  controllerDelete,
  controllerPut,
} from "./controllers";

const salesOrderRouter = Router();

salesOrderRouter.get("/", controllerGet);
salesOrderRouter.get("/:id", controllerGet);
salesOrderRouter.post("/", controllerPost);
salesOrderRouter.put("/:id", controllerPut);
salesOrderRouter.delete("/:id", controllerDelete);

export default salesOrderRouter;