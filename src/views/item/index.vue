<template>
    <DefaultLayout name="物品百科" slug="item" :publishEnable="true" :feedbackEnable="true" :adminEnable="false">
        <template #breadcrumb>
            <ItemBreadcrumb />
        </template>
        <template #left>
            <Sidebar :sidebar="globalSidebar" />
        </template>
        <keep-alive include="PlanList">
            <router-view />
        </keep-alive>
        <template #right>
            <Extend />
        </template>
    </DefaultLayout>
</template>

<script>
import DefaultLayout from '@/layout/DefaultLayout.vue';
import ItemBreadcrumb from "@/components/item/ItemBreadcrumb.vue";
import Sidebar from "@/components/item/Sidebar.vue";
import Extend from "@/components/item/Extend.vue";
export default {
    name: "ItemIndex"
}
</script>
