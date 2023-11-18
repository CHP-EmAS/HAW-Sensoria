import { Router} from "express";

import FishController from "../controllers/fishController";

import { validatePathParameter } from "../middlewares/validatePathParameter";

// ######### /fish route ######### //

const router = Router({ mergeParams: true })

//fish instance routes
router.get("/", FishController.getAllFishInfo)
router.post("/", FishController.createFish)

router.get("/:id", [validatePathParameter], FishController.getFishInfo)
router.patch("/:id", [validatePathParameter], FishController.patchFish)
router.delete("/:id", [validatePathParameter], FishController.deleteFish)

export default router
