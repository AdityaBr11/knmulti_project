import { Router } from "express";
import loginController from "./controllers/login";

const authRouter = Router();
authRouter.post("/login", loginController);

export default authRouter;
