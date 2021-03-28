import express from "express";
import {
  findRandomMusic,
  saveResult,
  updateVisitorCount,
} from "../controllers/apiController";

const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
  res.send("hi");
});
apiRouter.get("/updateVisitorCount", updateVisitorCount);

apiRouter.post("/result", saveResult, findRandomMusic);
export default apiRouter;
