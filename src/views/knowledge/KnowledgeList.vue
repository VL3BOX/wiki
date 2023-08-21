<template>
	<div class="v-knowledge-list" v-loading="loading">
		<!-- 搜索 -->
		<knowledgeSearch @onSearchKey="onSearchKey" />
		<!-- 搜索结果 & list列表 -->
		<knowledgeList v-if="list" :list="list" :total="total" :pagination="pagination" @onPageKey="onPageKey" />
	</div>
</template>

<script>
import knowledgeSearch from "@/components/knowledge/search.vue";
import knowledgeList from "@/components/knowledge/list.vue";
import { getKnowledgeList, getKnowledgeSearch } from "@/service/knowledge.js";

export default {
	name: "KnowledgeList",
	components: { knowledgeSearch, knowledgeList },
	data: function () {
		return {
			loading: false,
			search: "",
			list: "",

			page: 1,
			per: 20,
			total: 1,
			pages: 1,
		};
	},
	computed: {
		type() {
			return this.$route.params.knowledge_type;
		},
		params() {
			let params = {
				limit: this.per,
				page: this.page,
				knowledge_type: this.type,
			};
			if (this.search) {
				params.keyword = this.search
			}
			return params;
		},
		pagination() {
			return {
				page: this.page,
				total: this.total,
				per: this.per,
			};
		},
	},
	methods: {
		// 获取数据
		getData() {
			this.search ? this.getSearchData(this.params) : this.getListData(this.params);
		},
		// 按类别获取数据
		getListData(params) {
			this.loading = true;
			getKnowledgeList(params)
				.then((res) => {
					this.total = res.total;
					this.list = res.data;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		// 搜索获取数据
		getSearchData(params) {
			this.loading = true;
			getKnowledgeSearch(params)
				.then((res) => {
					this.list = res.data;
					this.total = res.total;
				})
				.finally(() => {
					this.loading = false;
				});
		},

		// 搜索关键词查找
		onSearchKey(val) {
			this.search = val;
			this.page = 1;
		},
		// 切换页码
		onPageKey(val) {
			this.page = val;
		},
	},
	watch: {
		params() {
			this.getData();
		},
		type() {
			this.page = 1;
		},
	},
	created: function () {
		this.getData();
	},
};
</script>
