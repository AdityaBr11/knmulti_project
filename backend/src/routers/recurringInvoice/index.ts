import { Router } from "express";
import {
  controllerPost,
  controllerGet,
  controllerDelete,
} from "./controllers";
import controllerPut from "./controllers/put";

const recurringInvoice = Router();

recurringInvoice.get("/", controllerGet);
recurringInvoice.get("/:id", controllerGet);
recurringInvoice.post("/", controllerPost);
recurringInvoice.put("/:id", controllerPut);
recurringInvoice.delete("/:id", controllerDelete);

export default recurringInvoice;