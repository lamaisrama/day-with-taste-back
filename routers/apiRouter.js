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
// apiRouter.post("/submit", findRandomMusic, addResult); // not used

apiRouter.get("/search", searchDaumMusic);
apiRouter.get("/music", getMusic);
// apiRouter.get("/lastfm", searchLastFMMusic); // not used
// apiRouter.get("/youtube", searchYoutubeMusic); // not used

apiRouter.get("/data", getData);
// apiRouter.post("/delete", deleteData);
// apiRouter.post("/initialize", deleteData, saveResult);

export default apiRouter;
