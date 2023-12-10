import { Router} from "express";

import FishController from "../controllers/fishController";

import { validatePathParameter } from "../middlewares/validatePathParameter";

// ######### /fish route ######### //

const router = Router({ mergeParams: true })

//fish instance routes
router.get("/", FishController.getLatestFishInfo)
router.post("/", FishController.createFish)

router.get("/:id", [validatePathParameter], FishController.getFishInfo)

export default router
