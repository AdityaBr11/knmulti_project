import { Router } from "express";
import controllerDelete from "./controllers/delete";
import controllerGet from "./controllers/get";
import controllerPost from "./controllers/post";
import controllerPut from "./controllers/put";

const notifyRouter = Router();

notifyRouter.get(`/`, controllerGet);
notifyRouter.post(`/`, controllerPost);
notifyRouter.put(`/:id`, controllerPut);
notifyRouter.delete(`/:id`, controllerDelete);

export default notifyRouter