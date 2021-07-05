const spicedPg = require("spiced-pg");
const database = "imageboard";

function getDatabaseURL() {
    if (process.env.DATABASE_URL) {
        return process.env.DATABASE_URL;
    }
    const { username, password } = require("./secrets.json");
    return `postgres:${username}:${password}@localhost:5432/${database}`;
}
const db = spicedPg(getDatabaseURL());
console.log(`[db] Connecting to ,${database}`);

function getImages() {
    return db.query(`SELECT * from images`).then((results) => {
        return results.rows;
    });
}
function insertImage(url, username, title, description) {
    return db
        .query(
            `INSERT INTO images (url, username, title, description) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *`,
            [url, username, title, description]
        )
        .then((result) => {
            return result.rows[0];
        });
}
function getImagesById(id) {
    return db
        .query(`SELECT * FROM images WHERE id = $1`, [id])
        .then((result) => {
            return result.rows[0];
        });
}
function getCommentsById(image_id) {
    return db
        .query(
            `SELECT * from comments WHERE image_id = $1 ORDER BY created_at DESC`,
            [image_id]
        )
        .then((result) => {
            return result.rows;
        });
}
function addCommentToImage({ image_id, username, comment_text }) {
    return db
        .query(
            `INSERT INTO comments (image_id, username, comment_text) VALUES ($1,$2,$3) RETURNING *`,
            [image_id, username, comment_text]
        )
        .then((result) => {
            return result.rows[0];
        });
}

module.exports = {
    getImages,
    insertImage,
    getImagesById,
    getCommentsById,
    addCommentToImage,
};
