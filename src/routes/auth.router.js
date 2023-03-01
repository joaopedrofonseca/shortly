import { Router } from "express";
import { signUp, signIn } from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import signInSchema from "../schemas/signInShema.js";
import signUpSchema from "../schemas/signUpSchema.js";

const authRouter = Router()

authRouter.post('/signup', validateSchema(signUpSchema), signUp)
authRouter.post('/signin', validateSchema(signInSchema), signIn)

export default authRouter