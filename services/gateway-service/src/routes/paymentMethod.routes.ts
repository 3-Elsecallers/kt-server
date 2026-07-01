import { Router } from "express";

import PaymentMethodController from "../controllers/paymentMethod.controller";
import Validation from "../validation/validation";

const router = Router();

router.post(
  "/initialize",
  Validation.userIdValidation,
  PaymentMethodController.initializePayment,
);
router.get("/verify/:reference", PaymentMethodController.verifyPayment);
router.get("/user/:userId", PaymentMethodController.getUserPaymentMethods);
router.get("/", PaymentMethodController.getAllPaymentMethods);
router.get("/:paymentMethodById", PaymentMethodController.getPaymentMethodById);

export default router;
