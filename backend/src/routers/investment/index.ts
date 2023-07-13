import { Router } from "express";
import {
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
} from "./controllers";

const investmentRouter = Router();

investmentRouter.get("/", controllerGet);
investmentRouter.get("/:id", controllerGet);
investmentRouter.post("/", controllerPost);
investmentRouter.put("/:id", controllerPut);
investmentRouter.delete("/:id", controllerDelete);

export default investmentRouter;
