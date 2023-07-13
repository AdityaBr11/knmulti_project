import { Router } from "express";
import {
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
} from "./controllers";
import { responseRouter } from "./routers";

const ticketsRouter = Router();

ticketsRouter.use("/response", responseRouter);
ticketsRouter.get("/", controllerGet);
ticketsRouter.get("/:id", controllerGet);
ticketsRouter.post("/", controllerPost);
ticketsRouter.put("/:id", controllerPut);
ticketsRouter.delete("/:id", controllerDelete);

export default ticketsRouter;
