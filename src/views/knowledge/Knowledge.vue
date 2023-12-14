<template>
    <DefaultLayout name="通识百科" slug="knowledge" without-right :publishEnable="true" :feedbackEnable="true">
        <template #left>
            <Nav>
            </Nav>
        </template>

        <router-view></router-view>
    </DefaultLayout>
</template>

<script>
import DefaultLayout from "@/layout/default-layout.vue";
import Nav from "@/components/knowledge/nav";
export default {
    name: "App",
    props: [],
    data: function () {
        return {};
    },
    computed: {},
    components: { Nav, DefaultLayout },
    mounted: function () {},
};
</script>

<style lang="less">
@import "~@/assets/css/app.less";
@import "~@/assets/css/knowledge/index.less";
</style>
