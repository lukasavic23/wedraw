import express from "express";
import { signUp, login, refresh } from "../controllers/authController";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/refresh", refresh);

export default router;
