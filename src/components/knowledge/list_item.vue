<template>
	<router-link v-if="data" class="m-knowledge-item" :to="{ name: 'view', params: { source_id: data.id } }">
		<div class="u-name">
			<span class="u-type"><i class="u-icon" :class="icons[data.type]"></i> {{ data.label }}</span>
			<span class="u-title">{{ data.name }}</span>
		</div>
		<div class="u-tags" v-if="hasTag(data.post)">
			<i class="el-icon-price-tag"></i>
			<span v-for="item in data.post.tags" :key="item">{{ item }}</span>
		</div>
		<span class="u-remark" v-if="data.post"> <i class="el-icon-edit"></i>最后修订：{{ data.post.remark }}@{{ data.post.user_nickname }} </span>
		<div class="u-updated" v-if="data.updated">
			<i class="el-icon-refresh"></i>
			<span> 最后更新于{{ date_format(data.updated) }}</span>
		</div>
	</router-link>
</template>
<script>
import icons from "@/assets/data/icons.json";
import { ts2str } from "@jx3box/jx3box-common/js/utils";
export default {
	name: "item",
	props: ["data"],
	data: function () {
		return {
			icons,
			date_format: ts2str,
		};
	},
	computed: {},
	watch: {},
	methods: {
		// 是否有标签
		hasTag(data) {
			return data && data.tags?.filter(Boolean).length ? true : false;
		},
	},
	created: function () {},
};
</script>
<style lang="less">
@import "~@/assets/css/knowledge/item.less";
</style>
