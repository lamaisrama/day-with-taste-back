import express from "express";
import {
  updateVisitorCount,
  saveResult,
  addResult
} from "../controllers/userController";
import {
  getMusic,
  searchYoutubeMusic,
  searchLastFMMusic,
  searchDaumMusic,
  findRandomMusic
} from "../controllers/musicController";
import {
  deleteData,
  getData
} from "../controllers/testController";

const apiRouter = express.Router();

apiRouter.get("/visit", updateVisitorCount);
apiRouter.post("/result", findRandomMusic, saveResult);
apiRouter.post("/submit", findRandomMusic, addResult);

apiRouter.get("/search", searchDaumMusic);
apiRouter.get("/lastfm", searchLastFMMusic);
apiRouter.get("/youtube", searchYoutubeMusic);
apiRouter.get("/music", getMusic);

apiRouter.post("/delete", deleteData);
apiRouter.get("/data", getData);

export default apiRouter;
