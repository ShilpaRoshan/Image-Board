console.log("Hello Vue!!");

new Vue({
    el: "#app",
    methods: {
        incrementCount: function () {
            console.log("[incrementCount]");
            console.log("[count]", this.count);
            this.count++;
        },
    },

    data: {
        message: "Hello world!",
        count: 0,
        todos: [
            { value: "Learn Vue" },
            { value: "Make image board" },
            { value: "Style the image board" },
        ],
    },
});
