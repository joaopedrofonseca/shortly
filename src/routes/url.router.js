import { Router } from "express"
import { deleteUrl, getRanking, getUrlById, getUserInfos, openUrl, shortUrl } from "../controllers/url.controller.js"
import { validateSchema } from "../middlewares/validateSchema.js"
import shortUrlSchema from "../schemas/shortUrlSchema.js"

const urlRouter = Router()

urlRouter.post('/urls/shorten', validateSchema(shortUrlSchema), shortUrl)
urlRouter.get('/urls/:id', getUrlById)
urlRouter.get('/urls/open/:shortUrl', openUrl)
urlRouter.delete('/urls/:id', deleteUrl)
urlRouter.get('/users/me', getUserInfos)
urlRouter.get('/ranking', getRanking)

export default urlRouter