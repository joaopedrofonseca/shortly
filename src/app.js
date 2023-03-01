import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from './routes/auth.router.js'
import urlRouter from './routes/url.router.js'

const app = express()
app.use(cors())
app.use(express.json())

dotenv.config()

app.use([authRouter, urlRouter])

app.listen(process.env.PORT || 5000, () => console.log(`SERVER: http://localhost:${process.env.PORT}`))