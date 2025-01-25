import express from "express";
import { register, login, getUsers } from "../controllers/auth.controller";
import { validateRegister, validateLogin } from "../middlewares/auth.validate";
import { isAuthenticateOptional, isAuthenticate } from "../middlewares/isAuthenticate";
const router = express.Router();

router.post("/register", isAuthenticateOptional,validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/get-users", isAuthenticate, getUsers)
export default router;
