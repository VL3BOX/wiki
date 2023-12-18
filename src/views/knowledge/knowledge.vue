<template>
    <DefaultLayout name="通识百科" slug="knowledge" without-right :publishEnable="true" :feedbackEnable="true">
        <template #left>
            <CommonNav>
                <KnowledgeNav> </KnowledgeNav>
            </CommonNav>
        </template>

        <router-view></router-view>
    </DefaultLayout>
</template>

<script>
import DefaultLayout from "@/layout/default-layout.vue";
import CommonNav from "@/components/common/nav.vue";
import KnowledgeNav from "@/components/knowledge/nav";
export default {
    name: "App",
    components: { CommonNav, KnowledgeNav, DefaultLayout },
    props: [],
    data: function () {
        return {};
    },
    computed: {},
    mounted: function () {},
};
</script>

<style lang="less">
@import "~@/assets/css/app.less";
@import "~@/assets/css/knowledge/index.less";
</style>
