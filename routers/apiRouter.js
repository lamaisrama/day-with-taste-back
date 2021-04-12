import express from "express";
import {
  findRandomMusic,
  saveResult,
  updateVisitorCount,
  searchYoutubeMusic,
  searchMusic,
} from "../controllers/apiController";

const apiRouter = express.Router();

apiRouter.get("/visit", updateVisitorCount);
apiRouter.get("/youtube", searchYoutubeMusic);
apiRouter.get("/search", searchMusic);
apiRouter.post("/result", findRandomMusic, saveResult);

export default apiRouter;
