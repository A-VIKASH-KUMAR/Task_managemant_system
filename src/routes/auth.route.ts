import express from "express";
import { register, login } from "../controllers/auth.controller";
import { validateRegister, validateLogin } from "../middlewares/auth.validate";
import { isAuthenticateOptional } from "../middlewares/isAuthenticate";
const router = express.Router();

router.post("/register", isAuthenticateOptional,validateRegister, register);
router.post("/login", validateLogin, login);

export default router;
