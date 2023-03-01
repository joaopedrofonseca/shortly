import { Router } from "express"
import { deleteUrl, getUrlById, openUrl, shortUrl } from "../controllers/url.controller.js"
import { validateSchema } from "../middlewares/validateSchema.js"
import shortUrlSchema from "../schemas/shortUrlSchema.js"

const urlRouter = Router()

urlRouter.post('/urls/shorten', validateSchema(shortUrlSchema), shortUrl)
urlRouter.get('/urls/:id', getUrlById)
urlRouter.get('/urls/open/:shortUrl', openUrl)
urlRouter.delete('/urls/:id', deleteUrl)

export default urlRouter