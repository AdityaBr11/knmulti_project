import { Router } from "express";
import { pBalSumGet, projectsSumGet, vBalSumGet, vCreditSumGet, vPurchaseGet } from "./controllers/get";

const reportRouter = Router();

reportRouter.get("/vbalsummary", vBalSumGet); 
reportRouter.get("/pbalsummary", pBalSumGet);
reportRouter.get("/vpurchase", vPurchaseGet);
reportRouter.get("/vcreditsum", vCreditSumGet);
reportRouter.get("/allprojectsummary", projectsSumGet);

export default reportRouter;