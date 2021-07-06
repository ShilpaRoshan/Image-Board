(function () {
    const IMG_LIMIT = 3;
    const getLastImageId = function (images) {
        let value;
        console.log("hello!");
        for (let i = 0; i < images.length; i++) {
            value = Math.min(images[i].id);
        }
        console.log("[value]", value);
        return value;
    };

    Vue.component("comments", {
        props: ["imageId"],
        template: "#comments",
        data: function () {
            return {
                comments: [],
                comment_text: "",
                username: "",
            };
        },
        mounted: function () {
            console.log("[vue:comments]", this.imageId);
            axios
                .get(`/api/images/${this.imageId}/comments`)
                .then((response) => {
                    console.log("[comments]", response.data);
                    this.comments = response.data;
                });
        },
        methods: {
            onSubmit: function () {
                console.log("[vue-comments:submit]");
                let values = {
                    comment_text: this.comment_text,
                    username: this.username,
                };
                axios
                    .post(`/api/images/${this.imageId}/comments`, values)
                    .then((response) => {
                        console.log("[response-onSubmit]", response.data);
                        this.comments.unshift(response.data);
                        this.comment_text = "";
                        this.username = "";
                    });
            },
        },
    });

    Vue.component("modal", {
        props: ["imageId"],
        template: "#modal",
        data: function () {
            return {
                image: {},
            };
        },
        mounted: function () {
            axios.get("/api/images/" + this.imageId).then((response) => {
                console.log("image-id", this.imageId);
                console.log("[mounted-component]", response.data);
                this.image = response.data;
            });
        },
        methods: {
            onCloseButtonClick: function () {
                console.log("hello");
                this.$emit("close-modal");
            },
        },
    });

    new Vue({
        el: "#main",
        mounted: function () {
            /*
            axios.get("/api/images.json").then((response) => {
                console.log("[response-data]", response.data);
                this.images = response.data;
            });*/
            const params = { last_id: this.lastImageId, limit: IMG_LIMIT };
            axios.get("/api/images.json", { params }).then((response) => {
                console.log("reponse.data", response.data, this.images);
                this.images = [...this.images, ...response.data];
                this.lastImageId = getLastImageId(this.images);
                if (this.lastImageId == 1) {
                    console.log("this.lastImageId", this.lastImageId);
                    this.showMoreButton = false;
                }
            });
        },
        methods: {
            uploadImage: function () {
                const formData = new FormData();
                //event.preventDefault();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("image", this.imageInput[0]);
                axios.post("/api/upload", formData).then((response) => {
                    console.log("[axios-post]", response);
                    this.images.push(response.data);
                });
            },
            handleUploadImage: function (event) {
                console.log(event.target);
                this.imageInput = event.target.images;
            },
            onImageClick: function (id) {
                console.log("[on-image-click]", id);
                this.currentImageId = id;
            },
            onClose: function () {
                this.currentImageId = null;
            },
            onMoreImagesButtonClick: function () {
                const params = { last_id: this.lastImageId, limit: IMG_LIMIT };
                axios.get("/api/images.json", { params }).then((response) => {
                    this.images = [...this.images, ...response.data];
                    this.lastImageId = getLastImageId(this.images);
                    if (this.lastImageId == 1) {
                        console.log("this.lastImageId", this.lastImageId);
                        this.showMoreButton = false;
                    }
                });
            },
        },
        data: {
            header: "Latest Images",
            images: [],
            imageInput: "",
            currentImageId: null,
            lastImageId: null,
            showMoreButton: true,
        },
    });
})();
