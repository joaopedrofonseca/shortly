import { db } from "../database/database.connection.js"
import bcrypt from 'bcrypt'
import { v4 as uuidV4 } from 'uuid'

export async function signUp(req, res) {
    const { name, email, password } = req.body
    try {
        const isEmailUnavailable = await db.query(`SELECT email FROM users WHERE email = $1`, [email])
        if (isEmailUnavailable.rows.length !== 0) return res.sendStatus(409)

        const hashPassword = bcrypt.hashSync(password, 10)

        await db.query(`INSERT INTO users(name, email, password) VALUES ($1, $2, $3);`, [name, email, hashPassword])
        return res.sendStatus(201)
    } catch (err) {
        return res.status(500).send(err.message)
    }
}

export async function signIn(req, res) {
    const { email, password } = req.body
    try {
        const emailExists = await db.query(`SELECT * FROM users WHERE email=$1`, [email])
        const isCorrectPassword = bcrypt.compareSync(password, emailExists.rows[0].password)
        if (emailExists.rows.length === 0 || !isCorrectPassword) return res.status(401).send("Usuário/senha incorretos!")

        const token = uuidV4()
        await db.query(`INSERT INTO sessions(user_email, token) VALUES ($1, $2);`, [email, token])
        return res.status(200).send({token})
    } catch (err) {
        return res.status(500).send(err.message)
    }
}