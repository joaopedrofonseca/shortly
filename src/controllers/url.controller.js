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

    try {
        const url = await db.query(`SELECT * FROM urls WHERE "shortUrl" = $1;`, [shortUrl])
        if (url.rows.length === 0) return res.sendStatus(404)

        await db.query(`UPDATE urls SET visitcount=visitcount+1 WHERE "shortUrl" = $1;`, [shortUrl])
        return res.redirect(url.rows[0].url)
    } catch (err) {
        return res.status(500).send(err.message)
    }
}

export async function deleteUrl(req, res) {
    const { id } = req.params
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")

    try {
        const urlExists = await db.query(`SELECT * FROM urls WHERE id = $1;`, [id])
        if (urlExists.rows.length === 0) return res.sendStatus(404)

        const urlAvailable = await db.query(`SELECT * FROM urls JOIN sessions ON urls."userId" = sessions.user_id WHERE urls.id = $1 AND sessions.token = $2;`, [id, token])
        if (urlAvailable.rows.length === 0) return res.sendStatus(401)

        await db.query(`DELETE FROM urls WHERE id = $1 AND "userId" = $2;`, [id, urlAvailable.rows[0].userId])
        return res.sendStatus(204)
    } catch (err) {
        return res.status(500).send(err.message)
    }
}

export async function getUserInfos(req, res) {
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")

    try {
        const tokenExists = await db.query(`SELECT * FROM sessions WHERE token = $1;`, [token])
        if (tokenExists.rows.length === 0) return res.sendStatus(401)

        const infos = await db.query(`SELECT users.id,
         users.name, 
         SUM(urls.visitcount) AS "visitCount", 
         ARRAY_AGG(
            JSON_BUILD_OBJECT(
                'id', urls.id,
                 'shortUrl', urls."shortUrl", 
                 'visitCount', urls.visitcount
                 )) AS "shortenedUrls"
                 FROM users 
                 JOIN urls ON users.id = urls."userId" 
                 WHERE users.id=$1 
                 GROUP BY users.id;`, [tokenExists.rows[0].user_id])
        return res.status(200).send(infos.rows[0])

    } catch (err) {
        return res.status(500).send(err.message)
    }
}