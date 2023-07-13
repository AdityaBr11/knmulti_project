import { Router } from "express";
import {
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
} from "./controllers";

const locationRouter = Router();

locationRouter.post("/", controllerPost);
locationRouter.delete("/:id", controllerDelete);
locationRouter.get("/:id", controllerGet);
locationRouter.put("/:id", controllerPut);
locationRouter.get("/", controllerGet);

export default locationRouter;
