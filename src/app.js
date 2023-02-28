import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

const app = express()
app.use(cors())
app.use(express.json())

dotenv.config()

app.listen(process.env.PORT || 5000, () => console.log(`SERVER: http://localhost:${process.env.PORT}`))