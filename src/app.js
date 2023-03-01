import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from './routes/auth.router.js'

const app = express()
app.use(cors())
app.use(express.json())

dotenv.config()

app.use([authRouter])

app.listen(process.env.PORT || 5000, () => console.log(`SERVER: http://localhost:${process.env.PORT}`))