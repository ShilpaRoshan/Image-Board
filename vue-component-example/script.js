const icecreams = [
    {
        id: 1,
        icecream: "vanilla",
        toppings: "chocoChips",
    },
    {
        id: 2,
        icecream: "chocolate",
        toppings: "nothing",
    },
];

Vue.component("icecream-select", {
    props: ["id", "icecream", "toppings"],
    template: "#icecream-select",
    methods: {
        onClick: function () {
            console.log("[in-component:OnClick]", this.id);
            this.$emit("icecream-click", this.id);
        },
    },
});

Vue.component("modal", {
    template: "#icecream-modal",
    props: ["id"],

    data: function () {
        return {
            icecream: null,
        };
    },
    mounted: function () {
        console.log("[model-mounnted-function]", this.id);
        const selected = icecreams.find((x) => x.id == this.id);
        this.icecream = selected.icecream;
    },
});

new Vue({
    el: "#main",
    data: {
        heading: "example of vue components",
        icecreams,
        currentId: null,
    },
    methods: {
        onClickIcecream: function (id) {
            console.log("[on-click-icecream]", id);
            this.currentId = id;
        },
    },
});
