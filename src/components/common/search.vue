<template>
    <div class="m-search-bar" :class="$route.name == 'view' ? 'can-return' : ''">
        <div class="m-return">
            <el-button class="u-return-btn" @click="returnHandle"><i class="el-icon-arrow-left"></i>返回</el-button>
        </div>
        <div class="m-search">
            <el-input
                class="u-search-input"
                v-model="keyword"
                @keydown.enter.native="searchHandle"
                :placeholder="placeholder"
                clearable
            >
                <span slot="prepend">
                    <slot><i class="el-icon-search"></i> 关键词</slot>
                </span>
                <el-button slot="append" class="u-search-btn" type="primary" plain @click="searchHandle"
                    ><i class="el-icon-position"></i> 搜索</el-button
                >
            </el-input>
        </div>
    </div>
</template>

<script>
export default {
    name: "CommonSearch",
    props: {
        placeholder: {
            type: String,
            default: "输入关键词「回车」进行搜索",
        },
    },
    data() {
        return {
            keyword: "",
        };
    },
    methods: {
        returnHandle() {
            if (history.length <= 1) {
                this.$router.push({
                    name: "home",
                });
            } else {
                history.back();
            }
        },
        searchHandle() {
            const keyword = this.keyword;
            this.$emit("search", keyword);
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/common/search.less";
</style>
