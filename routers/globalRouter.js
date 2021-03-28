import express from "express";
import routes from "../routes";
import { home, result } from "../controllers/testController";
import UserController from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.get(routes.home, home);
globalRouter.get(routes.result, result);
globalRouter.get(routes.visit, UserController.visitHome);
globalRouter.post(routes.submit, UserController.submitAnswer);

export default globalRouter;
