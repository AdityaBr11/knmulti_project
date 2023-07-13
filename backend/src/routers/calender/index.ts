import { Router } from "express";
import {
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
} from "./controllers";

const calenderRouter = Router();

calenderRouter.get("/", controllerGet);
calenderRouter.get("/:id", controllerGet);
calenderRouter.post("/", controllerPost);
calenderRouter.put("/:id", controllerPut);
calenderRouter.delete("/:id", controllerDelete);

export default calenderRouter;
