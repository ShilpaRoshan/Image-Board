const express = require("express");
const path = require("path");
const {
    getImages,
    insertImage,
    getImagesById,
    getCommentsById,
    addCommentToImage,
} = require("./db");

const { uploader } = require("./upload");
const { s3Upload } = require("./s3");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
//middleware for the request.body
app.use(express.urlencoded({ extended: false }));
//middleware for the json(request.body)
app.use(express.json());

app.get("/api/images.json", (request, response) => {
    getImages(request.query)
        .then((result) => {
            console.log("[result-getImages]", result);
            response.json(result);
        })
        .catch((error) => {
            console.log("[Error-in-getimages]", error);
            response.sendStatus(500);
        });
});

app.post(
    "/api/upload",
    uploader.single("image"),
    s3Upload,
    (request, response) => {
        const { username, title, description } = request.body;
        const { filename } = request.file;
        console.log("[upload]", request.body);
        console.log("[file]", request.file);
        const url = `https://s3.amazonaws.com/spicedling/${filename}`;
        //const url = `https://source.unsplash.com/random`;
        insertImage(url, username, title, description)
            .then((imageData) => {
                response.json(imageData);
            })
            .catch((error) => {
                console.log("[error-in-inserting-image]", error);
            });
    }
);

app.get("/api/images/:id", (request, response) => {
    const { id } = request.params;
    console.log("[request-params]", id);
    getImagesById(id)
        .then((image) => {
            if (!image) {
                console.log("no images found by id");
                response.sendStatus(500);
            }
            console.log("image-id", image.id);
            response.json(image);
        })
        .catch((error) => {
            console.log("error-in-getImagesById", error);
            response.sendStatus(500);
        });
});

app.get("/api/images/:image_id/comments", (request, response) => {
    const { image_id } = request.params;
    console.log("[getCommentsById:request-params]", image_id);
    getCommentsById(image_id)
        .then((comments) => {
            response.json(comments);
        })
        .catch((error) => {
            console.log("[error-in-getCommentsById]", error);
            response.sendStatus(500);
        });
});

app.post("/api/images/:image_id/comments", (request, response) => {
    const { image_id } = request.params;
    console.log("[addCommentToImage-request-params]", image_id);
    addCommentToImage({ image_id, ...request.body })
        .then((comment) => {
            response.json(comment);
        })
        .catch((error) => {
            console.log("[error-in-addCommentToImages]", error);
            response.sendStatus(500);
        });
});

app.listen(8080, () => {
    console.log("I am listening");
});
