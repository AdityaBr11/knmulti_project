import { Router } from "express";
import deleteRoleAccessPrem from "./controllers/delete";
import getRoleAccessPrem from "./controllers/get";
import postRoleAccessPrem from "./controllers/post";
import updateRoleAccessPrem from "./controllers/put";

const roleAccessPremRouter = Router()

roleAccessPremRouter.post("/", postRoleAccessPrem);
roleAccessPremRouter.get("/", getRoleAccessPrem);
roleAccessPremRouter.put("/:id", updateRoleAccessPrem);
roleAccessPremRouter.delete("/:id", deleteRoleAccessPrem);

export default roleAccessPremRouter;