import { Router } from "express";

import PaymentMethodController from "../controllers/paymentMethod.controller";
import Validation from "../validation/validation";

const router = Router();

router.post(
  "/",
  Validation.userIdValidation,
  PaymentMethodController.createPaymentMethod,
);
router.get("/", PaymentMethodController.getAllPaymentMethods);
router.get("/:paymentMethodById", PaymentMethodController.getPaymentMethodById);
router.get(
  "/user/:userId",
  Validation.userIdValidation,
  PaymentMethodController.getUserPaymentMethods,
);

export default router;
