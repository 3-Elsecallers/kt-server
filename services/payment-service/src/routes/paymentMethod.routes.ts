import { Router } from "express";
import {
  initializeCardSetup,
  getPaymentMethods,
  getPaymentMethod,
  getUserPaymentMethods,
  verifyPayment,
  recordPaymentMethod,
  chargeAuthorization,
} from "../controllers/paymentMethod.controller";

const router = Router();

router.post("/initialize", initializeCardSetup);
router.get("/verify/:reference", verifyPayment);
router.post("/record-payment-method", recordPaymentMethod);
router.post("/charge-authorization", chargeAuthorization);

router.get("/", getPaymentMethods);
router.get("/:paymentMethodId", getPaymentMethod);
router.get("/user/:userId", getUserPaymentMethods);

export default router;
