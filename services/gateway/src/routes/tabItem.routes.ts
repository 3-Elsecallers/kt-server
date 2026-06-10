import { Router } from "express";

import TabItemController from "../controllers/tabItem.controller";

const router = Router();

router.post("/", TabItemController.createTabItem);
router.get("/", TabItemController.getAllTabItems);
router.get("/:tabItemId", TabItemController.getTabItemById);
router.get("/:tabId/items", TabItemController.getTabItemsByTabId);
router.put("/:tabItemId", TabItemController.updateTabItem);
router.delete("/:tabItemId", TabItemController.deleteTabItem);

export default router;
