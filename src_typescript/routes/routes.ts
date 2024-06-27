import { Router, Request, Response } from "express";

import toObj from "../config/responseStandart";

import fishRoute from "./fishRoute";
import spaceRoute from "./spaceRoute";
import staticRoute from "./staticRoute";

import FishController from "../controllers/fishController";

import { authProtected } from "../middlewares/authenticationHandler"

const routes = Router();

routes.use("/fish", fishRoute);
routes.use("/space", [authProtected], spaceRoute)
routes.post("/toggle", [authProtected], FishController.toggleFishCreation)

routes.use("/", staticRoute);

routes.use("*", function(request: Request, response: Response) {
    response.status(403).json(toObj(response));
});

export default routes;
