import {Router} from "express";

import SpaceController from "../controllers/spaceController";

// ######### /space route ######### //

const router = Router({ mergeParams: true })

//space instance routes
router.get("/", SpaceController.getSortedScoreEntriesLimited)
router.post("/", SpaceController.createScoreEntry)

export default router
