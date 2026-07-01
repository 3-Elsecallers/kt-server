import { Router } from "express";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  signIn,
} from "../controllers/user.controller";

const router = Router();

router.post("/", createUser);
router.post("/sign-in", signIn);
router.get("/", getUsers);
router.get("/:userId", getUser);
router.patch("/:userId", updateUser);
router.delete("/:userId", deleteUser);

export default router;
