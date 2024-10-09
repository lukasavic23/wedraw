import express from "express";
import { signUp, login, getUser } from "../controllers/authController";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/me", getUser);

export default router;
