import { Router } from "express";
import {
  controllerGet,
  controllerDelete,
  controllerPost,
  controllerPut,
} from "./controllers";

const saleEstimateRouter = Router();

saleEstimateRouter.get("/", controllerGet);
saleEstimateRouter.get("/:id", controllerGet);
saleEstimateRouter.post("/", controllerPost);
saleEstimateRouter.put("/:id", controllerPut);
saleEstimateRouter.delete("/:id", controllerDelete);

export default saleEstimateRouter;
