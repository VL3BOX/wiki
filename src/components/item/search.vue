<template>
	<div class="m-search-bar" :class="$route.name == 'view' ? 'can-return' : ''">
		<div class="m-return">
			<el-button class="u-return-btn" @click="return_handle"><i class="el-icon-arrow-left"></i>返回</el-button>
		</div>
		<div class="m-search">
			<el-input class="u-search-input" v-model="keyword" @keydown.enter.native="search_handle" placeholder="输入物品名称（可适配中括号形式）/物品描述「回车」进行搜索">
				<span slot="prepend"> <i class="el-icon-search"></i> 关键词 </span>
				<el-button slot="append" class="u-search-btn" type="primary" plain @click="search_handle"> <i class="el-icon-position"></i> 搜索 </el-button>
			</el-input>
		</div>
	</div>
</template>

<script>
export default {
	name: "Search",
	data() {
		return {
			keyword: "",
		};
	},
	methods: {
		return_handle() {
      if (history.length <= 1) {
          this.$router.push({
              name: "home",
          });
      } else {
          history.back();
      }
		},
		search_handle() {
			let query = { page: 1 };
			// 菜单筛选
			if (this.$store.state.sidebar.AucGenre) query.auc_genre = this.$store.state.sidebar.AucGenre;
			if (this.$store.state.sidebar.AucSubTypeID) query.auc_sub_type_id = this.$store.state.sidebar.AucSubTypeID;

			this.$router.push({
				name: "search",
				params: { keyword: this.keyword },
				query: query,
			});
		},
	},
};
</script>

<style lang="less">
@import "~@/assets/css/item/search.less";
</style>
