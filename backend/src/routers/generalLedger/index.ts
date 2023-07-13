import { Router } from "express";
import generalLedgerDelete from "./controllers/delete";
import generalLedgerGet, { getTransectionByUserId, userTypeGet } from "./controllers/get";
import generalLedgerPost from "./controllers/post";
import generalLedgerPut from "./controllers/put";

const generalLedgerRouter = Router();

generalLedgerRouter.get("/", generalLedgerGet); 
generalLedgerRouter.post("/", generalLedgerPost);
generalLedgerRouter.put("/:ledgerId", generalLedgerPut);
generalLedgerRouter.delete("/:ledgerId", generalLedgerDelete);
generalLedgerRouter.get("/usertypelist", userTypeGet);
generalLedgerRouter.get("/usertransaction", getTransectionByUserId);

export default generalLedgerRouter;