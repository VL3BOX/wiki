<template>
    <nav class="m-nav">
        <el-input class="u-keyword" v-model="keyword" placeholder="输入关键字"> </el-input>
        <div class="m-menus-panel">
            <el-tree
                :data="maps"
                :props="defaultProps"
                :filter-node-method="filterNode"
                node-key="id"
                @node-click="clickNode"
                ref="tree"
                :indent="42"
            >
                <template slot-scope="{ node, data }">
                    <span v-if="!node.isLeaf" class="el-tree-node__label">
                        <span class="u-name" v-text="data.name"></span>
                        <em v-if="data.count" class="u-count" v-text="`(${data.count})`"></em>
                    </span>
                    <router-link v-else class="el-tree-node__label" :to="menuLink(data, node)">
                        <span class="u-name" v-text="data.name"></span>
                        <em v-if="data.count" class="u-count" v-text="`(${data.count})`"></em>
                    </router-link>
                </template>
            </el-tree>
        </div>
    </nav>
</template>

<script>
import { getQuestMaps } from "@/service/quest";
const questType = require("@/assets/data/quest-type.json");
import Bus from "@jx3box/jx3box-common-ui/service/bus";

export default {
    name: "Nav",
    data: () => ({
        keyword: "",
        maps: [],
        questType,
        defaultProps: {
            children: "children",
            label: "name",
        },
    }),
    computed: {
        client() {
            return this.$store.state.client;
        },
    },
    watch: {
        keyword(val) {
            this.$refs.tree.filter(val);
        },
    },
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        menuLink(menu, node) {
            return { name: "result", query: menu.id ? { map_id: menu.id } : {} };
        },
        loadMaps() {
            getQuestMaps().then((res) => {
                const mapObj = res.data?.data || {};
                const maps = [];
                for (let key in mapObj) {
                    if (questType[key]) {
                        maps.push({
                            id: key,
                            name: questType[key],
                            children: mapObj[key],
                            count: mapObj[key].map((item) => item.count).reduce((a, b) => a + b),
                        });
                    }
                }
                this.maps = maps;
            });
        },
        clickNode(data, node) {
            // 移动端收起边栏
            if (window.innerWidth < 1024) {
                if (node.isLeaf) {
                    Bus.$emit("toggleLeftSide", false);
                }
            }
        },
    },
    mounted() {
        this.loadMaps();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/quest/nav.less";
</style>
