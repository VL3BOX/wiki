import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const KnowledgeIndex = () => import("@/views/knowledge/knowledge-index.vue");
const KnowledgeList = () => import("@/views/knowledge/knowledge-list.vue");
const KnowledgeSingle = () => import("@/views/knowledge/knowledge-single.vue");
const Search = () => import("@/views/knowledge/search.vue");

const routes = [
    { name: "index", path: "/", component: KnowledgeIndex },
    { name: "normal", path: "/type/:knowledge_type([a-z_]+)", component: KnowledgeList },
    { name: "view", path: "/view/:source_id(\\d+)/:post_id(\\d+)?", component: KnowledgeSingle },
    // 搜索
    { name: "search", path: "/search/:keyword(.*)?", component: Search },
];

const router = new VueRouter({
    routes,
    base: "/knowledge",
    mode: "history",
});

router.beforeEach((to, from, next) => {
    if (to.fullPath.includes("/#")) {
        next(to.fullPath.replace("/#", ""));
    }
    next();
});

export default router;
