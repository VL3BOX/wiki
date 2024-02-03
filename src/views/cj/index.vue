<template>
    <DefaultLayout
        :name="$t('成就百科')"
        slug="cj"
        root="/cj"
        :publishEnable="true"
        :feedbackEnable="true"
        :adminEnable="false"
    >
        <template #breadcrumb>
            <AchievementCount />
        </template>
        <template #left>
            <CommonNav>
                <Sidebar :sidebar="$store.state.sidebar" />
            </CommonNav>
        </template>
        <Search :placeholder="placeholder" @search="search($event)" />
        <router-view />
        <template #right>
            <Info type="achievement" />
        </template>
    </DefaultLayout>
</template>

<script>
import DefaultLayout from "@/layout/default-layout.vue";
import AchievementCount from "@/components/cj/achievement-count.vue";
import Search from "@/components/common/search.vue";
import Sidebar from "@/components/cj/sidebar.vue";
import Info from "@/components/cj/extend.vue";
import { getAppIcon } from "@jx3box/jx3box-common/js/utils";
import CommonNav from "@/components/common/nav.vue";
export default {
    name: "App",
    data() {
        return {
            placeholder: "输入成就名称/成就描述/称号/奖励物品「回车」进行搜索",
        };
    },
    components: {
        AchievementCount,
        Sidebar,
        Search,
        Info,
        DefaultLayout,
        CommonNav,
    },
    computed: {
        isSingle() {
            return this.$route.name == "view";
        },
    },
    watch: {
        $route: {
            immediate: true,
            handler() {
                if (!this.$route.params.sub && !this.$route.params.detail && !this.$route.params.source_id) {
                    this.$store.state.sidebar.sub = null;
                    this.$store.state.sidebar.detail = null;
                } else {
                    if (this.$route.params.sub) this.$store.state.sidebar.sub = this.$route.params.sub;
                    if (this.$route.params.detail) this.$store.state.sidebar.detail = this.$route.params.detail;
                }

                if (this.$store.state.sidebar.general == 3 && this.$route.name) {
                    this.$set(this.$store.state.sidebar, "other", this.$route.name);
                }
            },
        },
    },
    methods: {
        getAppIcon,
        search(keyword) {
            delete this.$store.state.scroll_tops["search"];
            this.$router.push({
                name: "search",
                params: { keyword: keyword.trim().replace(/(?:^\[)|(?:\]$)/gi, "") },
            });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/app.less";
@import "~@/assets/css/cj/index.less";
</style>
