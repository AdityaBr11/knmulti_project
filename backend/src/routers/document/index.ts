import { Router } from "express";
import {
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
} from "./controllers";

const documentsRouter = Router();

documentsRouter.get("/", controllerGet);
documentsRouter.get("/:id", controllerGet);
documentsRouter.post("/", controllerPost);
documentsRouter.put("/:id", controllerPut);
documentsRouter.delete("/:id", controllerDelete);

export default documentsRouter;
