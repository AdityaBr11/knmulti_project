import { Router } from "express";
import {
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
} from "./controllers";

const holidayRouter = Router();

holidayRouter.get("/", controllerGet);
holidayRouter.get("/:id", controllerGet);
holidayRouter.post("/", controllerPost);
holidayRouter.put("/:id", controllerPut);
holidayRouter.delete("/:id", controllerDelete);

export default holidayRouter;
