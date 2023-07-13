import { Router } from "express";
import controllerDelete from "./controllers/delete";
import controllerGet from "./controllers/get";
import controllerPost from "./controllers/post";
import controllerPut from "./controllers/put";


const payrollRouter = Router();

// payroll 
payrollRouter.get("/", controllerGet);
payrollRouter.post("/", controllerPost);
payrollRouter.put("/:id", controllerPut);
payrollRouter.delete("/:id", controllerDelete);

export default payrollRouter;