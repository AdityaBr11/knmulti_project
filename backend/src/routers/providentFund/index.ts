import { Router } from "express";
import {
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
} from "./controllers";

const providentFundRouter = Router();

providentFundRouter.get("/", controllerGet);
providentFundRouter.get("/:id", controllerGet);
providentFundRouter.post("/", controllerPost);
providentFundRouter.put("/:id", controllerPut);
providentFundRouter.delete("/:id", controllerDelete);

export default providentFundRouter;
