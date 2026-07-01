import { Router } from "express";
import {
  // createTransaction,
  markTransactionSuccessful,
  markTransactionFailed,
  getTransactionsByTab,
} from "../controllers/transaction.controller";

const router = Router();

// router.post("/", createTransaction);
router.post("/:transactionId/success", markTransactionSuccessful);
router.post("/:transactionId/fail", markTransactionFailed);
router.get("/tab/:tabId", getTransactionsByTab);

export default router;
