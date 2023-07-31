import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = {
    state: {
        client: location.href.includes("origin") ? "origin" : "std",
    },
    mutations: {},
    actions: {},
    modules: {},
}

export default new Vuex.Store(store);
