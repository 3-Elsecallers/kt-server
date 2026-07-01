import { Router } from "express";
import {
  createTab,
  getTabs,
  getUserTab,
  getTab,
  updateTab,
  deleteTab,
  activateTab,
  settleTab,
  closeTab,
  abandonTab,
  reopenTab,
  getVenueTabs,
} from "../controllers/tab.controller";

const router = Router();

router.post("/", createTab);
router.get("/", getTabs);
router.get("/user/:userId", getUserTab);
router.get("/venue/:venueId", getVenueTabs);
router.get("/:tabId", getTab);
router.put("/:tabId", updateTab);
router.delete("/:tabId", deleteTab);

router.post("/:tabId/activate", activateTab);
router.post("/:tabId/settle", settleTab);
router.post("/:tabId/close", closeTab);
router.post("/:tabId/abandon", abandonTab);
router.post("/:tabId/reopen", reopenTab);

export default router;
