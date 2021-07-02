const express = require("express");
const path = require("path");
const { getImages, insertImage } = require("./db");
const { uploader } = require("./upload");
//const { s3 } = require("./s3");

const app = express();
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/images.json", (request, response) => {
    //console.log("hello!");
    getImages()
        .then((result) => {
            // console.log("[result-images]", result);
            //let jsonedResult = JSON.stringify(result);
            //console.log("[jsonedResult]", response.json(result));
            response.json(result);
        })
        .catch((error) => {
            console.log("[Error-in-getimages]", error);
            response.sendStatus(500);
        });
});

app.post("/api/upload", uploader.single("image"), (request, response) => {
    console.log("[upload]", request.body);
    console.log("[file]", request.file);
    const { imgTitle, imgDescription, username } = request.body;
    const { filename } = request.file;
    //const imgUrl = `https://s3.amazonaws.com/spicedling/${filename}`;
    const imgUrl = `https://source.unsplash.com/random`;
    insertImage(imgTitle, imgDescription, username, imgUrl)
        .then((imageData) => {
            response.json(imageData);
        })
        .catch((error) => {
            console.log("[error-in-inserting-image]", error);
        });
});

app.listen(8080, () => {
    console.log("I am listening");
});
