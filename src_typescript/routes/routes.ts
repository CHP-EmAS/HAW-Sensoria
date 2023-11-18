import { Router, Request, Response } from "express";

import toObj from "../config/responseStandart";

import {API_VERSION} from "../sensoria_api_server";

import fish from "./fishRoute";
import FishController from "../controllers/fishController";

import { authProtected } from "../middlewares/authenticationHandler"

const routes = Router();

routes.use("/fish", fish);

routes.post("/toggle", [authProtected], FishController.toggleFishCreation)

routes.get("/", function(request: Request, response: Response) {
    const welcomeMsg = { API_NAME: process.env.APP_NAME + " API", API_VERSION: API_VERSION};
    response.status(200).json(toObj(response,welcomeMsg));
});

routes.use("*", function(request: Request, response: Response) {
    response.status(403).json(toObj(response));
});

export default routes;
