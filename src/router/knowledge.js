import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const KnowledgeIndex = () => import("@/views/knowledge/KnowledgeIndex.vue");
const KnowledgeList = () => import("@/views/knowledge/KnowledgeList.vue");
const KnowledgeSingle = () => import("@/views/knowledge/KnowledgeSingle.vue");

const routes = [
    { name: "index", path: "/", component: KnowledgeIndex },
    { name: "normal", path: "/type/:knowledge_type([a-z_]+)", component: KnowledgeList },
    { name: "view", path: "/view/:source_id(\\d+)/:post_id(\\d+)?", component: KnowledgeSingle },
];

const router = new VueRouter({
    routes,
    base: '/knowledge',
    mode: 'history',
});

router.beforeEach((to, from, next) => {
    if (to.fullPath.includes('/#')) {
        next(to.fullPath.replace('/#', ''));
    }
    next()
});

export default router;
