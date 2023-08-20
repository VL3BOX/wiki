<template>
    <nav class="m-nav">
        <el-input class="u-keyword" v-model="keyword" placeholder="输入分类关键字">
            <el-select @change="getMenus" style="width: 82px" v-model="by" slot="prepend" placeholder="分类依据">
                <el-option label="地图" value="map"></el-option>
                <el-option label="分类" value="class"></el-option>
            </el-select>
        </el-input>
        <div class="m-menus-panel">
            <el-tree class="m-menus" :data="search_menus" node-key="id" ref="tree">
                <router-link
                    v-if="data.name.indexOf(keyword) >= 0"
                    class="el-tree-node__label"
                    slot-scope="{ node, data }"
                    :to="menuLink(data, node)"
                >
                    <span class="u-name" v-text="'【 ' + data.name + ' 】'"></span>
                    <em v-if="data.total" class="u-count" v-text="`(${data.total})`"></em>
                </router-link>
            </el-tree>
        </div>
    </nav>
</template>

<script>
import { getCategory } from "@/service/quest";

export default {
    name: "Nav",
    data: () => ({
        keyword: "",
        by: "map",
        menus: [],
    }),
    computed: {
        search_menus() {
            if (!this.keyword) return this.menus;
            return this.menus.filter((menu) => {
                return menu.name.indexOf(this.keyword) >= 0;
            });
        },
        client() {
            return this.$store.state.client;
        },
    },
    methods: {
        menuLink(menu, node) {
            if (this.by == "class") {
                return { name: "result", query: menu.id ? { class_id: menu.id } : {} };
            } else {
                return { name: "result", query: menu.id ? { map_id: menu.id } : {} };
            }
        },
        getMenus() {
            getCategory({
                by: this.by,
                client: this.client,
            }).then((res) => {
                this.menus = res.data;
            });
        },
    },
    mounted() {
        this.getMenus();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/quest/nav.less";
</style>
