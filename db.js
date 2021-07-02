const spicedPg = require("spiced-pg");
const database = "imageboard";

function getDatabaseURL() {
    if (process.env.DATABASE_URL) {
        return process.env.DATABASE_URL;
    }
    const { AWS_KEY, AWS_SECRET } = require("./secrets.json");
    return `postgres:${AWS_KEY}:${AWS_SECRET}@localhost:5432/${database}`;
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

module.exports = {
    getImages,
    insertImage,
};
