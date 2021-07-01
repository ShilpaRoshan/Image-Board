(function () {
    new Vue({
        el: "#main",
        mounted: function () {
            axios.get("/api/images.json").then((response) => {
                console.log("[response-data]", response.data);
                this.images = response.data;
            });
        },
        data: {
            header: "Latest Images",
            images: [],
        },
    });
})();
