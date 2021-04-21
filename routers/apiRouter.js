import express from "express";
import {
  findRandomMusic,
  saveResult,
  updateVisitorCount,
  searchYoutubeMusic,
  searchMusic,
  addResult,
  getMusic,
  deleteData,
  getData
} from "../controllers/apiController";

const apiRouter = express.Router();

apiRouter.get("/visit", updateVisitorCount);
apiRouter.get("/youtube", searchYoutubeMusic);
apiRouter.post("/result", findRandomMusic, saveResult);

/* Last.FM API 이용 */
apiRouter.get("/search", searchMusic);
apiRouter.post("/submit", findRandomMusic, addResult);
apiRouter.get("/music", getMusic);

/* TEST 용도 */
apiRouter.post("/delete", deleteData);
apiRouter.get("/data", getData);

export default apiRouter;
