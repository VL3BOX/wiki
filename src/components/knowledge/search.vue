<template>
    <div class="m-knowledge-search">
        <el-input placeholder="请输入搜索内容" v-model="search">
            <span slot="prepend">关键词</span>
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
    </div>
</template>
<script>
export default {
    name: "Search",
    data: function () {
        return {
            search: "",
        };
    },
    watch: {
        search(val) {
            this.$emit("onSearchKey", val);
        },
    },
};
</script>
