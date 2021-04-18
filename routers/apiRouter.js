import express from "express";
import {
  findRandomMusic,
  saveResult,
  updateVisitorCount,
  searchYoutubeMusic,
  searchMusic,
  addResult,
  deleteData
} from "../controllers/apiController";

const apiRouter = express.Router();

apiRouter.get("/visit", updateVisitorCount);
apiRouter.get("/youtube", searchYoutubeMusic);
apiRouter.post("/result", findRandomMusic, saveResult);

/* Last.FM API 이용 */
apiRouter.get("/search", searchMusic);
apiRouter.post("/submit", findRandomMusic, addResult);

/* TEST DATA 지우는 용도 */
apiRouter.post("/delete", deleteData);

export default apiRouter;
