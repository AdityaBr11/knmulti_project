import { Router } from "express";
import {
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
} from "./controllers";

const loanRouter = Router();
loanRouter.get("/", controllerGet);
loanRouter.get("/:id", controllerGet);
loanRouter.post("/", controllerPost);
loanRouter.put("/:id", controllerPut);
loanRouter.delete("/:id", controllerDelete);

export default loanRouter;
