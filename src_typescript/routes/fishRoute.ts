import { Router} from "express";

import FishController from "../controllers/fishController";

import { validatePathParameter } from "../middlewares/validatePathParameter";

// ######### /fish route ######### //

const router = Router({ mergeParams: true })

//fish instance routes
router.get("/", [validatePathParameter], FishController.getAllFishInfo)

router.get("/:id", [validatePathParameter], FishController.getFishInfo)
router.patch("/:id", [validatePathParameter], FishController.patchFish)
router.delete("/:id", [validatePathParameter], FishController.deleteFish)

export default router
