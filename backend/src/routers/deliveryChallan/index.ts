import { Router } from "express";
import {
  controllerPost,
  controllerGet,
  controllerDelete,
  controllerPut,
} from "./controllers";

const deliveryChallanRouter = Router();

deliveryChallanRouter.get("/", controllerGet);
deliveryChallanRouter.get("/:id", controllerGet);
deliveryChallanRouter.post("/", controllerPost);
deliveryChallanRouter.put("/:id", controllerPut);
deliveryChallanRouter.delete("/:id", controllerDelete);

export default deliveryChallanRouter;