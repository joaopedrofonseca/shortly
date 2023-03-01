import { nanoid } from "nanoid"
import { db } from "../database/database.connection.js"

export async function shortUrl(req, res) {
    const { url } = req.body
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")
    const shortUrl = nanoid(8)

    try {
        const isTokenActive = await db.query(`SELECT * FROM sessions WHERE token = $1;`, [token])
        if (isTokenActive.rows.length === 0) return res.sendStatus(401)

        await db.query(`INSERT INTO urls(url, "shortUrl", "userId") VALUES ($1, $2, $3);`, [url, shortUrl, isTokenActive.rows[0].id])
        const lastUrl = await db.query(`SELECT id,"shortUrl" FROM urls WHERE "shortUrl" = $1;`, [shortUrl])
        return res.status(201).send(lastUrl.rows[0])
    } catch (err) {
        return res.status(500).send(err.message)
    }
}

export async function getUrlById(req, res) {
    const { id } = req.params

    try {
        const url = await db.query(`SELECT id, "shortUrl", url FROM urls WHERE id = $1;`, [id])
        if (url.rows.length === 0) return res.sendStatus(404)
        return res.status(200).send(url.rows[0])
    } catch (err) {
        return res.status(500).send(err.message)
    }
}

export async function openUrl(req, res) {
    const { shortUrl } = req.params
    
    try{
        const url = await db.query(`SELECT * FROM urls WHERE "shortUrl" = $1;`, [shortUrl])
        if (url.rows.length === 0) return res.sendStatus(404)
        return res.redirect(url.rows[0].url)
    }catch(err){
        return res.status(500).send(err.message)
    }
}