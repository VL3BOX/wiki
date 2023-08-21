<template>
    <div class="v-knowledge-single" v-loading="loading">
        <div class="m-navigation">
            <el-button class="u-goback" size="medium" icon="el-icon-arrow-left" @click="goBack" plain>返回列表</el-button>
            <!-- <Fav class="u-collect" post-type="knowledge" :post-id="id" /> -->
            <el-button v-if="isEditor" size="medium" icon="el-icon-delete" plain type="danger" @click="del">删除</el-button>
        </div>

        <div class="m-wiki" v-if="data && data.post">
            <WikiPanel class="m-knowledge-panel" :wiki-post="data">
                <template slot="head-title">
                    <img class="u-icon" svg-inline src="../../assets/img/knowledge.svg" />
                    <span>{{ title }} </span>
                </template>
                <template slot="head-actions">
                    <a class="el-button el-button--primary" :href="publishLink(`knowledge/${id}`)">
                        <i class="el-icon-edit"></i>
                        <span>完善百科通识</span>
                    </a>
                </template>
                <template slot="body">
                    <Article :content="content" />
                    <Thx class="m-thx" :postId="id" postType="knowledge" :postTitle="title" :userId="author_id" :adminBoxcoinEnable="true" :userBoxcoinEnable="true" mode="wiki" :authors="authors" :key="'item-thx-' + id" />
                </template>
            </WikiPanel>

            <WikiRevisions v-if="id" type="knowledge" :source-id="id" style="margin-bottom: 35px" />

            <template v-if="id">
                <el-divider content-position="left">讨论</el-divider>
                <Comment :id="id" category="knowledge" />
            </template>
        </div>

        <div v-else class="m-wiki-null">
            <i class="el-icon-s-opportunity"></i>
            <span>暂无内容，我要</span>
            <a class="s-link" :href="publishLink(`knowledge/${id}`)">完善百科通识</a>
        </div>
    </div>
</template>

<script>
import { getKnowledgeDetail, getKnowledgePost, removeKnowledge } from "@/service/knowledge.js";
import { postStat } from "@jx3box/jx3box-common/js/stat";
import { publishLink } from "@jx3box/jx3box-common/js/utils";
import WikiPanel from "@jx3box/jx3box-common-ui/src/wiki/WikiPanel";
import WikiRevisions from "@jx3box/jx3box-common-ui/src/wiki/WikiRevisions";
import User from "@jx3box/jx3box-common/js/user";

import Article from "@jx3box/jx3box-editor/src/Article.vue";
import Comment from "@jx3box/jx3box-comment-ui/src/Comment.vue";

export default {
    name: "Detail",
    data: function () {
        return {
            loading: false,
            data: "",
        };
    },
    components: {
        Article,
        WikiPanel,
        WikiRevisions,
        Comment,
    },
    computed: {
        id: function () {
            return this.$route.params.source_id;
        },
        type: function () {
            return this.data?.source?.type;
        },
        isRevision: function () {
            return !!this.$route.params.post_id;
        },
        author_id: function () {
            return ~~this.data?.post?.user_id;
        },
        title: function () {
            return this.data?.source?.name;
        },
        content: function () {
            return this.data?.post?.content;
        },
        authors: function () {
            if (!this.isRevision) {
                return (
                    this.data?.users
                        ?.filter((user) => user.id)
                        ?.map((user) => {
                            return {
                                user_id: user.id,
                                user_avatar: user.avatar,
                                display_name: user.nickname,
                            };
                        }) || []
                );
            }
            return [];
        },
        isEditor: function (){
            return User.isEditor();
        }
    },
    methods: {
        getData() {
            this.loading = true;
            getKnowledgeDetail(this.id)
                .then((res) => {
                    this.data = res;
                    if (this.data.source) this.data.source.post = this.data.post;
                })
                .finally(() => {
                    this.loading = false;
                    postStat(this.type, this.id);
                });
        },
        getPostData() {
            this.loading = true;
            getKnowledgePost(this.$route.params.post_id)
                .then((res) => {
                    this.data = res;
                    if (this.data.source) this.data.source.post = this.data.post;
                })
                .finally(() => {
                    this.loading = false;
                    postStat(this.type, this.id);
                });
        },
        goBack() {
            if (this.data?.source?.type) {
                this.$router.push({ name: "normal", params: { knowledge_type: this.data.source.type } });
            } else {
                this.$router.push({ name: "index" });
            }
        },
        publishLink,
        // 删除
        del() {
            this.$confirm("此操作将永久删除该百科通识, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    removeKnowledge(this.id)
                        .then((res) => {
                            this.$message({
                                type: "success",
                                message: "删除成功!",
                            });
                            this.goBack();
                        })
                        .catch((err) => {
                            this.$message({
                                type: "error",
                                message: "删除失败!",
                            });
                        });
                })
        }
    },
    created: function () {
        this.getData(this.id);
    },
    watch: {
        "$route.params.post_id": {
            immediate: true,
            handler() {
                if (this.$route.params.post_id) {
                    // 获取指定攻略
                    this.getPostData();
                }
            },
        },
    },
};
</script>

<style lang="less">
    .m-wiki,
    .m-wiki-null {
        .mt(20px);
    }
    .m-wiki-null {
        .x;
        .r(5px);
        .fz(15px);
        padding: 20px;
        background-color: #fafbfc;
        border: 1px solid #eee;

        a:hover {
            box-shadow: 0 1px 0 @primary;
        }
    }
    .m-navigation {
        .flex;
        justify-content: space-between;
        align-items: center;
    }
    .w-boxcoin-records-list {
        background-color: #fff;
    }
    .m-thx {
        .mt(20px);
    }
</style>
