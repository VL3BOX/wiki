<template>
	<div class="m-knowledge-panel">
		<div class="m-title">
			<span class="u-title-left"><i class="el-icon-time"></i><span> 最新更新</span></span>
		</div>
		<div class="m-recent m-panel">
			<div class="m-post" v-for="(post, key) in list" :key="key">
				<div class="m-head">
					<div class="m-source">
						<div class="u-source">
							<img class="u-icon" svg-inline src="../../assets/img/knowledge.svg" />
							<router-link class="u-name" :to="{ name: 'view', params: { source_id: post.source_id } }" v-text="post.title"></router-link>
						</div>
						<div class="u-remark" v-if="post.remark" v-text="'📑 ' + post.remark"></div>
					</div>
				</div>
				<div class="m-body">
					<div class="u-excerpt" :to="{ name: 'view', params: { source_id: post.source_id } }" v-html="ellipsis(post.excerpt)"></div>
				</div>
				<div class="m-user">
					<div class="u-author">
						<img class="u-icon" :src="post.user_avatar" :alt="post.user_nickname" />
						<a :href="post.user_id ? authorLink(post.user_id) : null" class="u-name" v-text="post.user_nickname"></a>
					</div>
					<div class="u-updated" v-text="ts2str(post.updated)"></div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { getKnowledgeNewest } from "@/service/knowledge.js";
import { authorLink, ts2str } from "@jx3box/jx3box-common/js/utils";
export default {
	name: "Recent",
	data: function () {
		return {
			list: "",
		};
	},
	computed: {},
	watch: {},
	methods: {
		// 获取最新帖子数据
		getRecentData() {
			getKnowledgeNewest({ type: "knowledge", limit: this.per }).then((res) => {
				this.list = res.newest;
			});
		},

		authorLink,
		ts2str,

		ellipsis(value) {
			value = value ? value.trim() : "";
			if (value.length > 100) {
				return value.slice(0, 100) + "...";
			}
			return value;
		},
	},
	created: function () {
		this.getRecentData();
	},
};
</script>
<style scoped lang="less">
.m-recent {
	.m-post {
		.fz(12px);
		.clip;
		padding: 15px 10px;
		border-bottom: 1px solid #ccc;
		&:last-child {
			border-bottom: none;
		}
		.u-icon {
			.dbi;
			.w(20px);
			.r(3px);
			vertical-align: middle;
		}
		.u-name {
			.dbi;
			.ml(8px);
			vertical-align: middle;
			&:not([href]) {
				color: #3d454d;
			}
			.underline(@color-link);
		}
		.m-achievement {
			.mt(5px);
		}
		.u-author,
		.u-updated,
		.u-source,
		.u-remark {
			.mr(25px);
			display: inline-block;
			vertical-align: middle;
		}
		.m-user {
			.x(right);
		}
		.u-updated {
			// .fr;
			.mr(0);
			opacity: 0.75;
		}
		.u-remark {
			margin: 5px 0;
		}
		.u-excerpt {
			.db;
			.mt(6px);
			.lh(1.6);
			color: #999;
		}
	}
}
</style>
