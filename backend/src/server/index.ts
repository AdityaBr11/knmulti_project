import express from "express";
import router from "../routers";
import cors from "cors";
import fileUpload from "express-fileupload";

const config = require("../config/index");
const scheduler = require("../scheduler");

const app = require("express")();

const whitelist = ["http://127.0.0.1:8001", "https://hrm-xi.vercel.app" , "https://knmultidemo.vercel.app"];
const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(express.json({ limit: "50mb" }));
app.use(
  // cors({
  //   origin: "http://127.0.0.1:8001",
  //   methods: "GET,POST,PUT,PATCH,DELETE",
  // })
  cors(corsOptions)
);
app.use(fileUpload());

app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);


scheduler.initCrons(config);


export default app;
