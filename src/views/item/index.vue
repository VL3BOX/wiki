<template>
    <DefaultLayout name="物品百科" slug="item" root="/item" :publishEnable="true" :feedbackEnable="true" :adminEnable="false">
        <template #breadcrumb>
            <ItemBreadcrumb />
        </template>
        <template #left>
            <CommonNav>
                <Sidebar :sidebar="globalSidebar" />
            </CommonNav>
        </template>
        <Search :placeholder="placeholder" @search="search($event)" />
        <keep-alive include="PlanList">
            <router-view />
        </keep-alive>
        <template #right>
            <Extend />
        </template>
    </DefaultLayout>
</template>

<script>
import DefaultLayout from "@/layout/default-layout.vue";
import ItemBreadcrumb from "@/components/item/item-breadcrumb.vue";
import Sidebar from "@/components/item/sidebar.vue";
import Extend from "@/components/item/extend.vue";
import Search from "@/components/common/search.vue";
import CommonNav from "@/components/common/nav.vue";
export default {
    name: "ItemIndex",
    components: { DefaultLayout, ItemBreadcrumb, Sidebar, Extend, Search, CommonNav },
    data() {
        return {
            placeholder: "输入物品名称（可适配中括号形式）/物品描述「回车」进行搜索",
        };
    },
    computed: {
        globalSidebar() {
            return this.$store.state.sidebar;
        },
        query() {
            return this.$route.query;
        },
        params() {
            return this.$route.params;
        },
    },
    watch: {
        $route: {
            // immediate: true,
            handler() {
                let sidebar = {};
                if (
                    typeof this.params.AucGenre === "undefined" &&
                    typeof this.params.AucSubTypeID === "undefined" &&
                    typeof this.query.auc_genre === "undefined" &&
                    typeof this.query.auc_sub_type_id === "undefined" &&
                    !this.params.item_id
                ) {
                    sidebar = { AucGenre: null, AucSubTypeID: null };
                } else {
                    sidebar = {
                        AucGenre: this.query.auc_genre || "",
                        AucSubTypeID: this.query.auc_sub_type_id || "",
                    };
                    // 如存在路由参数，优先使用路由参数
                    if (this.params.AucGenre) {
                        sidebar = {
                            AucGenre: this.params.AucGenre === "empty" ? "" : this.params.AucGenre,
                            AucSubTypeID: this.params.AucSubTypeID || "",
                        };
                    }
                }
                this.$store.commit("SET_STATE", { key: "sidebar", value: sidebar });
            },
        },
    },
    methods: {
        search(keyword) {
            let query = { page: 1 };
            // 菜单筛选
            if (this.$store.state.sidebar.AucGenre) query.auc_genre = this.$store.state.sidebar.AucGenre;
            if (this.$store.state.sidebar.AucSubTypeID) query.auc_sub_type_id = this.$store.state.sidebar.AucSubTypeID;

            this.$router.push({
                name: "search",
                params: { keyword: keyword },
                query: query,
            });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/app.less";
</style>
