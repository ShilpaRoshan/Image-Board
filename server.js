const express = require("express");
const path = require("path");
const { getImages } = require("./db");

const app = express();
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/images.json", (request, response) => {
    //console.log("hello!");
    getImages().then((result) => {
        // console.log("[result-images]", result);
        //let jsonedResult = JSON.stringify(result);
        //console.log("[jsonedResult]", response.json(result));
        response.json(result);
    });
});

app.listen(8080, () => {
    console.log("I am listening");
});
