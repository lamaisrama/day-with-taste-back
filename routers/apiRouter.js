import express from "express";
import {
  findRandomMusic,
  saveResult,
  updateVisitorCount,
  searchMusic,
} from "../controllers/apiController";

const apiRouter = express.Router();

apiRouter.get("/visit", updateVisitorCount);
apiRouter.post("/youtube", searchMusic);
apiRouter.post("/result", findRandomMusic, saveResult);

export default apiRouter;
