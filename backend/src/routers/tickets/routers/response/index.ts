import { Router } from "express";
import { controllerDelete, controllerGet, controllerPost } from "./controllers";

const responseRouter = Router();

responseRouter.get("/", controllerGet);
responseRouter.get("/:id", controllerGet);
responseRouter.post("/", controllerPost);
responseRouter.delete("/:id", controllerDelete);

export default responseRouter;
