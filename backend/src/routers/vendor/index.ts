import { Router } from "express";
import {
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
} from "./controllers";

const vendorRouter = Router();

vendorRouter.get("/", controllerGet);
vendorRouter.get("/:id", controllerGet);
vendorRouter.post("/", controllerPost);
vendorRouter.delete("/:id", controllerDelete);
vendorRouter.put("/:id", controllerPut);

export default vendorRouter;
