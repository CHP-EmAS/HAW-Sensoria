import { Router, Request, Response } from "express";

import toObj from "../config/responseStandart";

import {API_VERSION} from "../sensoria_api_server";

import fishRoute from "./fishRoute";
import staticRoute from "./staticRoute";

import FishController from "../controllers/fishController";

import { authProtected } from "../middlewares/authenticationHandler"

const routes = Router();

routes.use("/fish", fishRoute);
routes.post("/toggle", [authProtected], FishController.toggleFishCreation)

routes.use("/", staticRoute);

routes.use("*", function(request: Request, response: Response) {
    response.status(403).json(toObj(response));
});

export default routes;
