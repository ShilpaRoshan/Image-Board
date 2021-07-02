(function () {
    new Vue({
        el: "#main",
        mounted: function () {
            axios.get("/api/images.json").then((response) => {
                console.log("[response-data]", response.data);
                this.images = response.data;
            });
        },
        methods: {
            uploadImage: function () {
                const formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("image", this.imageInput[0]);
                axios.post("/api/upload", formData).then((response) => {
                    console.log("[axios-post]", response);
                    this.images.push(response.data);
                });
            },
        },
        data: {
            header: "Latest Images",
            images: [],
        },
    });
})();
