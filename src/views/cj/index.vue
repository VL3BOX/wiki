<template>
    <DefaultLayout name="成就百科" slug="cj" root="/cj" :publishEnable="true" :feedbackEnable="true" :adminEnable="false">
        <template #breadcrumb>
            <AchievementCount />
        </template>
        <template #left>
            <Sidebar :sidebar="$store.state.sidebar" />
        </template>
        <Search />
        <router-view />
        <template #right>
            <Info />
        </template>
    </DefaultLayout>
</template>

<script>
import DefaultLayout from "@/layout/DefaultLayout.vue";
import AchievementCount from "@/components/cj/AchievementCount.vue";
import Sidebar from "@/components/cj/Sidebar.vue";
import Search from "@/components/cj/Search.vue";
import Info from "@/components/cj/Extend.vue";
import { getAppIcon } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "App",
    data() {
        return {};
    },
    components: {
        AchievementCount,
        Sidebar,
        Search,
        Info,
        DefaultLayout,
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
    },
};
</script>

<style lang="less">
@import "~@/assets/css/cj/index.less";
</style>
