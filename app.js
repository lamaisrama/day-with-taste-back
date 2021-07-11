import express from "express";
import bodyParser from "body-parser";
import apiRouter from "./routers/apiRouter";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
var corsOption = {
    origin: `${process.env.ALLOWED_DOMAIN}`,
    optionsSuccessStatus: 200
}

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOption));
app.use("/", apiRouter);

export default app;
