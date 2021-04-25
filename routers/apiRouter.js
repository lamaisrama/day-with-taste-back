import express from "express";
import {
  updateVisitorCount,
  findRandomMusic,
  searchMusic,
  addResult,
  getMusic,
} from "../controllers/apiController";
import {
  searchYoutubeMusic,
  saveResult,
  deleteData,
  getData,
  searchVideo
} from "../controllers/testController";

const apiRouter = express.Router();

apiRouter.get("/visit", updateVisitorCount);

/* Last.FM API 이용 */
apiRouter.get("/search", searchMusic);
apiRouter.post("/submit", findRandomMusic, addResult);
apiRouter.get("/music", getMusic);

/* Youtube API 이용(deprecated) */
apiRouter.get("/youtube", searchYoutubeMusic);
apiRouter.post("/result", findRandomMusic, saveResult);
/* TEST 용도 */
apiRouter.post("/delete", deleteData);
apiRouter.get("/data", getData);
apiRouter.get("/test", searchVideo);

export default apiRouter;
