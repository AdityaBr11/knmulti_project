import { Router } from "express";
import controllerDelete, { splitStockDelete } from "./controllers/delete";
import controllerGet, { splitStockGet, transferStockGet } from "./controllers/get";
import controllerPost, { billStockPost, splitStockPost, transferStockPost } from "./controllers/post";
import controllerPut, { SplitStkPut } from "./controllers/put";

const stockRouter = Router();

// stock 
stockRouter.get("/", controllerGet);
stockRouter.post("/", controllerPost);
stockRouter.delete("/:id", controllerDelete);
stockRouter.put("/:id", controllerPut);

// bill stock 
stockRouter.post("/billStock", billStockPost);

// split stock 
stockRouter.get("/splitStock", splitStockGet);
stockRouter.post("/splitStock", splitStockPost);
stockRouter.put("/splitStock/:id", SplitStkPut);
stockRouter.delete("/splitStock/:id", splitStockDelete);

// transfer stock 
stockRouter.get("/transtock", transferStockGet);
stockRouter.post("/transtock", transferStockPost);

export default stockRouter;