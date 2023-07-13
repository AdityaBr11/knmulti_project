import { Router } from "express";
import {
  commentPut,
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
  getChallans,
  getEstimates,
  getInvoices,
  getNotes,
  getOrders,
  getPaymentsReceived,
} from "./controllers";
import { getTimeline } from "./controllers/get";
import { postTimeline } from "./controllers/post";

const customerRouter = Router();

customerRouter.get("/", controllerGet);
customerRouter.get("/:id", controllerGet);
customerRouter.post("/", controllerPost);
customerRouter.put("/:id", controllerPut);
customerRouter.put("/comment/:id", commentPut as any);
customerRouter.delete("/:id", controllerDelete);

customerRouter.get("/estimate/:id", getEstimates);
customerRouter.get("/orders/:id", getOrders);
customerRouter.get("/challans/:id", getChallans);
customerRouter.get("/invoices/:id", getInvoices);
customerRouter.get("/payments/:id", getPaymentsReceived);
customerRouter.get("/notes/:id", getNotes);

// timeline 
customerRouter.get("/timeline/:customerId", getTimeline);
customerRouter.post("/timeline", postTimeline);

export default customerRouter;
