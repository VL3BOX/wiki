<template>
    <DefaultLayout name="任务百科" slug="quest" without-right :publishEnable="true" :feedbackEnable="true" :crumbEnable="false">
        <template #left>
            <Nav></Nav>
        </template>
        <router-view></router-view>
    </DefaultLayout>
</template>

<script>
import Nav from "@/components/quest/nav.vue";
import DefaultLayout from "@/layout/default-layout.vue";

export default {
    name: "Quest",
    components: { Nav, DefaultLayout },
};
</script>
