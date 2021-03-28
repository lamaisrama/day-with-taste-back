import express from "express";
import bodyParser from "body-parser";
import apiRouter from "./routers/apiRouter";
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", apiRouter);

export default app;
