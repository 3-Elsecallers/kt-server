import { Router } from "express";
import {
  createPaymentMethod,
  getPaymentMethods,
  getPaymentMethod,
  getUserPaymentMethods,
} from "../controllers/paymentMethod.controller";

const router = Router();

router.post("/", createPaymentMethod);
router.get("/", getPaymentMethods);
router.get("/:paymentMethodId", getPaymentMethod);
router.get("/user/:userId", getUserPaymentMethods);

export default router;
