import { Router } from "express";
import {
  controllerDelete,
  controllerGet,
  controllerPost,
  controllerPostAttachment,
  controllerPut,
  controllerPostLayout,
  controllerPostSubPlots,
  controllerPostLandDivisionCSV,
  controllerStatusPut,
} from "./controllers";
import { controllerGetAllStatus } from "./controllers/get";
import taskRouter from "./routers";

const projectRouter = Router();

projectRouter.use("/tasks", taskRouter);

projectRouter.get("/allstatus", controllerGetAllStatus);
projectRouter.get("/", controllerGet);
projectRouter.get("/:id", controllerGet);
projectRouter.post("/", controllerPost);
projectRouter.post("/:id/attachment", controllerPostAttachment);
projectRouter.post("/:id/layout", controllerPostLayout);
projectRouter.post("/:id/subPlots", controllerPostSubPlots);
projectRouter.post("/:id/landDivision/csv", controllerPostLandDivisionCSV);
projectRouter.put("/:id", controllerPut as any);
projectRouter.put("/status/:id", controllerStatusPut as any);
projectRouter.delete("/:id", controllerDelete);

export default projectRouter;
