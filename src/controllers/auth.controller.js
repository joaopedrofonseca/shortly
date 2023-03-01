import { db } from "../database/database.connection.js" 

export async function signUp(req, res) {
    const { name, email, password } = req.body
    try {
        const isEmailAvailable = await db.query(`SELECT email FROM users WHERE email = $1`, [email])
        if (isEmailAvailable.rows.length !== 0) return res.sendStatus(409)
        await db.query(`INSERT INTO users(name, email, password) VALUES ($1, $2, $3);`, [name, email, password])
        return res.sendStatus(201)
    } catch (err) {
        return res.status(500).send(err.message)
    }
}