import { Router } from "express";
import { signUp } from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import signUpSchema from "../schemas/signUpSchema.js";

const authRouter = Router()

authRouter.post('/signup', validateSchema(signUpSchema),signUp)

export default authRouter