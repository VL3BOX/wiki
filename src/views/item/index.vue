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
import DefaultLayout from '@/layout/default-layout.vue';
import ItemBreadcrumb from "@/components/item/item-breadcrumb.vue";
import Sidebar from "@/components/item/sidebar.vue";
import Extend from "@/components/item/extend.vue";
export default {
    name: "ItemIndex",
    components: { DefaultLayout, ItemBreadcrumb, Sidebar, Extend },
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
				if (typeof this.params.AucGenre === "undefined" && typeof this.params.AucSubTypeID === "undefined" && typeof this.query.auc_genre === "undefined" && typeof this.query.auc_sub_type_id === "undefined" && !this.params.item_id) {
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
}
</script>
