import { Router } from "express";
import {
  applyToInvoicePut,
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
} from "./controllers";

const creditNotesRouter = Router();

creditNotesRouter.get("/", controllerGet);
creditNotesRouter.get("/:id", controllerGet);
creditNotesRouter.post("/", controllerPost);
creditNotesRouter.put("/:id", controllerPut);
creditNotesRouter.put("/invoice-update/:id", applyToInvoicePut);
creditNotesRouter.delete("/:id", controllerDelete);

export default creditNotesRouter;
