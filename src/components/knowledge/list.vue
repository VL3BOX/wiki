<template>
	<div>
		<!-- 搜索结果 -->
		<div class="m-knowledge" v-if="list">
			<template v-if="list.length">
				<knowledgeItem v-for="(item, index) in list" :key="index" :data="item" />
			</template>
			<div v-else class="m-noKnowledge"><el-alert title="没有对应的百科" type="info" center show-icon> </el-alert></div>
		</div>

		<!-- 翻页 -->
		<el-pagination class="m-archive-pages" background layout="total, prev, pager, next, jumper" :hide-on-single-page="true" :page-size="pagination.per" :total="pagination.total" :current-page.sync="pagination.page" @current-change="changePage"></el-pagination>
	</div>
</template>
<script>
import knowledgeItem from "@/components/knowledge/list_item.vue";
export default {
	name: "list",
	props: ["list", "pagination"],
	components: {
		knowledgeItem,
	},
	methods: {
		changePage(i) {
			this.$emit("onPageKey", i);
		},
	},
};
</script>
<style lang="less">
.m-noKnowledge,
.m-archive-pages {
	.mt(20px);
}
</style>
