import { Router } from "express";
import {
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
} from "./controllers";

const expenseRouter = Router();

expenseRouter.get("/", controllerGet);
expenseRouter.get("/:id", controllerGet);
expenseRouter.delete("/:id", controllerDelete);
expenseRouter.post("/", controllerPost);
expenseRouter.put("/:id", controllerPut);

export default expenseRouter;
