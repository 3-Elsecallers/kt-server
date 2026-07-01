import { Router } from "express";

import UserController from "../controllers/user.controller";
import Validation from "../validation/validation";

const router = Router();

router.post("/", UserController.createUser);
router.post("/sign-in", UserController.signIn);
router.get("/", UserController.getAllUsers);
router.get("/:userId", UserController.getUserById);
router.patch("/:userId", UserController.updateUser);
router.delete("/:userId", UserController.deleteUser);

router.post(
  "/record-payment-method/:userId",
  Validation.tabIdValidation, 
  Validation.venueIdValidation,
  UserController.recordUserPaymentMethod
);

export default router;
