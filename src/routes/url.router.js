import { Router } from "express"
import { getUrlById, shortUrl } from "../controllers/url.controller.js"
import { validateSchema } from "../middlewares/validateSchema.js"
import shortUrlSchema from "../schemas/shortUrlSchema.js"

const urlRouter = Router()

urlRouter.post('/urls/shorten', validateSchema(shortUrlSchema), shortUrl)
urlRouter.get('/urls/:id', getUrlById)

export default urlRouter