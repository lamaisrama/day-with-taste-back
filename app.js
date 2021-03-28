import express from "express";
import bodyParser from "body-parser";
import routes from "./routes";
import globalRouter from "./routers/globalRouter";
import youtubeRouter from "./routers/youtubeRouter";
import apiRouter from "./routers/apiRouter";
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(routes.home, globalRouter);
// app.use(routes.youtube, youtubeRouter);
app.use("/", apiRouter);

export default app;
