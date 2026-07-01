import { Router } from "express";
import {
  createTabItem,
  getTabItems,
  getTabItem,
  updateTabItem,
  deleteTabItem,
  getTabItemsByTabId,
} from "../controllers/tabItem.controller";

const router = Router();

router.post("/", createTabItem);
router.get("/", getTabItems);
router.get("/:itemId", getTabItem);
router.put("/:itemId", updateTabItem);
router.delete("/:itemId", deleteTabItem);

router.get("/:tabId/items", getTabItemsByTabId);

export default router;
