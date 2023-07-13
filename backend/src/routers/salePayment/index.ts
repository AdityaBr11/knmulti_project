import { Router } from "express";
import {
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPut,
} from "./controllers";
import { getPatmentofInv } from "./controllers/get";
import { updatePayCredits } from "./controllers/put";

const salePaymentRouter = Router();

salePaymentRouter.get("/", controllerGet);
salePaymentRouter.get("/customerinvpay", getPatmentofInv);
salePaymentRouter.get("/:id", controllerGet);
salePaymentRouter.delete("/:id", controllerDelete);
salePaymentRouter.post("/", controllerPost);
salePaymentRouter.put("/paycredit", updatePayCredits);
// salePaymentRouter.put("/:id", controllerPut);


export default salePaymentRouter;
