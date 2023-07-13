import { Request } from "express";
import { IEmployee } from "../db/schema/employee";

interface RequestWithUser extends Request {
  user: IEmployee;
}

export default RequestWithUser;
