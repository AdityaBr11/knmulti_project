import { Router } from "express";
import {
  controllerDelete,
  controllerGetInvoice,
  controllerGetInvoiceByCustomerId,
  controllerPost,
  controllerPut,
} from "./controllers";

const saleInvoiceRouter = Router();

saleInvoiceRouter.get("/", controllerGetInvoice);
saleInvoiceRouter.get("/:id", controllerGetInvoice);
// saleInvoiceRouter.get("/recurring/:id", controllerGetRecurringInvoices);
// saleInvoiceRouter.get("/recurring", controllerGetRecurringInvoices);
saleInvoiceRouter.get("/customer-id/:id", controllerGetInvoiceByCustomerId);
saleInvoiceRouter.delete("/:id", controllerDelete);
saleInvoiceRouter.post("/", controllerPost);
saleInvoiceRouter.put("/:id", controllerPut);

export default saleInvoiceRouter;
