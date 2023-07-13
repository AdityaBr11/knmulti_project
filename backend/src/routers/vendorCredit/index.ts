import { Router } from "express";
import { controllerDelete, controllerGet, controllerPost } from "./controllers";

const vendorCreditRouter = Router();

vendorCreditRouter.get("/", controllerGet);
vendorCreditRouter.get("/:id", controllerGet);
vendorCreditRouter.delete("/:id", controllerDelete);
vendorCreditRouter.post("/", controllerPost);
vendorCreditRouter.put("/:id", controllerPost);

export default vendorCreditRouter;
