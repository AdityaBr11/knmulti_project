import { Router } from "express";
import { controllerGet } from "./controllers/get";
import controllerPost from "./controllers/post";
import controllerPut from "./controllers/put";

const landSaleRouter = Router();

landSaleRouter.get("/", controllerGet);
landSaleRouter.post("/", controllerPost);
landSaleRouter.put("/:id", controllerPut);

export default landSaleRouter;