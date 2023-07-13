// verify auth token in the request header

import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export default async function auth(req: Request, res: Response, next: any) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  try {
    jwt.verify(
      token.split(" ")[1],
      process.env.JWT_SECRET!,
      (err: any, decoded: any) => {
        if (err) {
          return res.status(401).send({ message: "Unauthorized" });
        }
        (req as any).user = decoded;
        next();
      }
    );
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized" });
  }
}
