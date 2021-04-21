import express from "express";
import bodyParser from "body-parser";
import apiRouter from "./routers/apiRouter";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/", apiRouter);

export default app;
