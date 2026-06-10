import { Router } from "express";

import TabController from "../controllers/tab.controller";

const router = Router();

router.post("/", TabController.createTab);
router.get("/", TabController.getAllTabs);
router.get("/:tabId", TabController.getTabById);
router.put("/:tabId", TabController.updateTab);
router.delete("/:tabId", TabController.deleteTab);

router.post("/:tabId/activate", TabController.activateTab);
router.post("/:tabId/settle", TabController.settleTab);
router.post("/:tabId/close", TabController.closeTab);
router.post("/:tabId/abandon", TabController.abandonTab);
router.post("/:tabId/reopen", TabController.reopenTab);

export default router;
