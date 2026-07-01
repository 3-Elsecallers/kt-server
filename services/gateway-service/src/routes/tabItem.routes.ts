import { Router } from "express";

import TabItemController from "../controllers/tabItem.controller";
import Validation from "../validation/validation";

const router = Router();

router.post("/", Validation.createTabItemValidation, TabItemController.createTabItem);
router.get("/", TabItemController.getAllTabItems);
router.get("/:tabItemId", TabItemController.getTabItemById);
router.get("/:tabId/items", TabItemController.getTabItemsByTabId);
router.put("/:tabItemId", TabItemController.updateTabItem);
router.delete("/:tabItemId", TabItemController.deleteTabItem);

export default router;
