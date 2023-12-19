<template>
    <div class="m-right-side" :class="{ isHome: isHome }">
        <SideMsg></SideMsg>

        <div class="m-rank">
            <h2 class="m-title">
                <img class="u-icon" svg-inline src="@/assets/img/cj/rank.svg" />
                <span class="u-text">贡献榜</span>
            </h2>
            <ul class="u-list">
                <li v-for="(rank, k) in ranks" :key="k">
                    <a class="u-contributor" :href="rank.user_id ? author_url(rank.user_id) : null">
                        <i class="u-avatar">
                            <img :src="showAvatar(rank.avatar)" :alt="rank.nickname" />
                        </i>
                        <span class="u-name" v-text="rank.nickname"></span>
                        <em class="u-count">+ {{ rank.count }}</em>
                    </a>
                </li>
            </ul>
        </div>

        <div class="m-group">
            <h2 class="m-title">
                <img class="u-icon" svg-inline src="@/assets/img/cj/puzzle.svg" />
                <span class="u-text">各区服成就群</span>
                <a class="u-show-message" target="_blank" href="https://www.jx3box.com/tool/13659/">申请展示 »</a>
            </h2>
            <div class="m-group-content">
                <el-tree
                    class="m-group-tree"
                    :default-expand-all="false"
                    :data="groups"
                    node-key="uuid"
                    @node-click="clickNode"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { authorLink, showAvatar } from "@jx3box/jx3box-common/js/utils";
import { getMenuGroup } from "@/service/group";
import { getAchievementRanking } from "@/service/achievement";
import { __ossRoot, __ossMirror } from "@jx3box/jx3box-common/data/jx3box.json";
import SideMsg from "@/components/common/side-msg.vue";
import { v4 as uuid } from "uuid";

export default {
    name: "Extend",
    props: {
        type: {
            type: String,
            default: "achievement",
        }
    },
    components: {
        SideMsg,
    },
    data() {
        return {
            ranks: [],
            groups: [],
            isHome: true,

            qq: "614370825",
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
    },
    methods: {
        showAvatar,
        clickNode(data) {
            if (!data.children) {
                const val = data.label;
                this.copy(val);
            }
        },
        copy(text) {
            navigator.clipboard.writeText(text).then(() => {
                this.$notify({
                    title: "复制成功",
                    message: text,
                    type: "success",
                });
            });
        },
        author_url: authorLink,
        copy_success() {
            this.$notify({ title: "复制成功", type: "success" });
        },
        copy_error() {
            this.$notify({ title: "浏览器不支持", type: "error" });
        },
        loadRank() {
            const params = {
                type: this.type,
                client: this.client,
            }
            getAchievementRanking(params).then((res) => {
                this.ranks = res.data?.data || [];
            });
        },
        checkIsHome: function () {
            this.isHome = this.$route.name == "home" || !this.$route.name;
        },
        onQQClick() {
            navigator.clipboard.writeText(this.qq).then(() => {
                this.$notify({
                    title: "复制成功",
                    message: "内容：" + this.qq,
                    type: "success",
                });
            });
        },
        loadGroups() {
            getMenuGroup("wiki_cj_group").then((res) => {
                const groups = res.data?.data?.menus || [];
                const newGroups = groups.map((item) => {
                    return {
                        zone: item.label.split("/")[0],
                        server: item.label.split("/")?.[1] || "",
                        children: item.link.split("/"),
                        priority: item.priority,
                    };
                });
                this.groups = this.convertToTree(newGroups);
            });
        },
        convertToTree(data) {
            const tree = {};

            data.forEach((item) => {
                const zone = item.zone;

                if (!tree[zone]) {
                    tree[zone] = {
                        label: zone,
                        children: [],
                        uuid: uuid(),
                    };
                }

                const serverNode = {
                    label: item.server,
                    children: item.children.map((val) => {
                        return {
                            label: val,
                            uuid: uuid(),
                        };
                    }),
                    priority: item.priority,
                    uuid: uuid(),
                };

                tree[zone].children.push(serverNode);
            });

            return Object.values(tree);
        },
    },
    mounted() {
        // 获取成就群
        this.loadGroups();
        this.checkIsHome();
        this.loadRank();
    },
    watch: {
        "$route.name": function () {
            this.checkIsHome();
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/cj/right-side.less";
.m-group-tree {
    .is-leaf + .el-tree-node__label:before {
        content: "»";
        color: #3d454d;
        margin-right: 5px;
    }
}
</style>
