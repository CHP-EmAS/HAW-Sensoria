import { Router, Request, Response } from "express";

import toObj from "../config/responseStandart";

import {API_VERSION} from "../sensoria_api_server";

import fish from "./fishRoute";

const routes = Router();

routes.use("/fish", fish);

routes.get("/", function(request: Request, response: Response) {
    const welcomeMsg = { API_NAME: process.env.APP_NAME + " API", API_VERSION: API_VERSION};
    response.status(200).json(toObj(response,welcomeMsg));
});

routes.use("*", function(request: Request, response: Response) {
    response.status(403).json(toObj(response));
});

export default routes;
