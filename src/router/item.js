import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

// 组件懒加载
const Home = () => import("@/views/item/home.vue");
const Normal = () => import("@/views/item/normal.vue");
const Detail = () => import("@/views/item/detail.vue");
const PlanDetail = () => import("@/views/item/plan-detail.vue");
const PlanList = () => import("@/views/item/plan-list.vue");
const PlanEdit = () => import("@/views/item/plan-edit.vue");
const Search = () => import("@/views/item/search.vue");
const Waiting = () => import("@/views/item/waiting.vue");

const routes = [
    // 主页
    { name: "home", path: "/", component: Home },
    // 常规
    { name: "normal", path: "/:AucGenre([empty|\\d]+)/:AucSubTypeID(\\d+)", component: Normal },
    // 搜索
    { name: "search", path: "/search/:keyword(\\s?|.+)?", component: Search },

    // 单页
    { name: "view", path: "/view/:item_id([_\\d]+)/:post_id(\\d+)?", component: Detail },

    // 清单单页
    { name: "plan_view", path: "/plan_view/:plan_id(\\d+)", component: PlanDetail },
    // 编辑清单
    { name: "plan_edit", path: "/plan_edit/:plan_id(\\d+)", component: PlanEdit },
    // 清单列表
    {
        name: "plan_list",
        path: "/plan_list/:keyword(.+)?",
        component: PlanList,
    },
    { name: "waiting", path: "/waiting", component: Waiting },
];

const router = new VueRouter({
    routes,
    base: '/item',
    mode: "history",
});

router.beforeEach((to, from, next) => {
    if (to.fullPath.includes('/#')) {
        next(to.fullPath.replace('/#', ''));
    }
    next()
});

export default router;
