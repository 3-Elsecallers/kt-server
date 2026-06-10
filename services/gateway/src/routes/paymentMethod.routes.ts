import { Router } from "express";

import PaymentMethodController from "../controllers/paymentMethod.controller";

const router = Router();

router.post("/", PaymentMethodController.createPaymentMethod);
router.get("/", PaymentMethodController.getAllPaymentMethods);
router.get("/:paymentMethodById", PaymentMethodController.getPaymentMethodById);
router.get("/user/:userId", PaymentMethodController.getUserPaymentMethods);

export default router;
