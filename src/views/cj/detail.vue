<template>
    <div class="m-detail-view">
        <AchievementSingle v-if="source" :achievement="source" show-favorite="true" />

        <Notice></Notice>
        <div class="m-wiki-post-panel" v-if="wiki_post && wiki_post.post">
            <WikiPanel :wiki-post="wiki_post">
                <template slot="head-title">
                    <img class="u-icon" svg-inline src="@/assets/img/cj/achievement.svg" />
                    <span class="u-txt">{{ $t('成就攻略') }}</span>
                </template>
                <template slot="head-actions">
                    <a class="el-button el-button--primary" :href="publish_url(`achievement/${id}`)">
                        <i class="el-icon-edit"></i>
                        <span>{{ $t('完善成就攻略') }}</span>
                    </a>
                </template>
                <template slot="body">
                    <!-- <Notice></Notice> -->
                    <div class="m-wiki-compatible" v-if="compatible">
                        <i class="el-icon-warning-outline"></i> {{ $t('暂无缘起攻略，以下为重制攻略，仅作参考，') }}<a
                            class="s-link"
                            :href="publish_url(`achievement/${id}`)"
                            >{{ $t('参与修订') }}</a
                        >。
                    </div>
                    <Article :content="wiki_post.post.content" />
                    <div class="m-wiki-signature">
                        <i class="el-icon-edit"></i>
                        {{ $t('本次修订由') }} <b>{{ user_name }}</b> {{ $t('提交于') + updated_at }}
                    </div>
                </template>
            </WikiPanel>

            <Relations :source-id="id" />

            <!-- 历史版本 -->
            <WikiRevisions type="achievement" :source-id="id" />

            <!-- 打赏 -->
            <div class="m-wiki-thx-panel">
                <WikiPanel>
                    <template slot="head-title">
                        <i class="el-icon-coin"></i>
                        <span class="u-txt">{{ $t('参与打赏') }}</span>
                    </template>
                    <template slot="body">
                        <Thx
                            class="m-thx"
                            :postId="~~id"
                            postType="achievement"
                            :postTitle="favTitle"
                            :userId="author_id"
                            :adminBoxcoinEnable="true"
                            :userBoxcoinEnable="true"
                            mode="wiki"
                            :authors="authors"
                            :key="'achievement-thx-' + id"
                            :client="client"
                        />
                    </template>
                </WikiPanel>
            </div>

            <!-- 百科评论 -->
            <WikiComments type="achievement" :source-id="id" />
        </div>
        <div class="m-wiki-post-empty" v-if="is_empty">
            <i class="el-icon-s-opportunity"></i>
            <span>{{ $t('暂无攻略，我要') }}</span>
            <a class="s-link" :href="publish_url(`achievement/${id}`)">{{ $t('完善攻略') }}</a>
        </div>
    </div>
</template>

<script>
import Article from "@jx3box/jx3box-editor/src/Article.vue";
import WikiPanel from "@/components/wiki-panel.vue";
import WikiRevisions from "@/components/wiki-revisions.vue";
import WikiComments from "@/components/wiki-comments.vue";
import AchievementSingle from "@/components/cj/achievement-single.vue";
import Relations from "@/components/relations.vue";
import Notice from "@/components/cj/notice.vue";
import { postStat } from "@jx3box/jx3box-common/js/stat";
import { wiki } from "@jx3box/jx3box-common/js/wiki_v2";
import { publishLink } from "@jx3box/jx3box-common/js/utils";
import { ts2str } from "@jx3box/jx3box-common/js/utils.js";
import { reportNow } from "@jx3box/jx3box-common/js/reporter";

import { get_achievement } from "@/service/achievement";
export default {
    name: "Detail",
    components: {
        AchievementSingle,
        WikiPanel,
        WikiRevisions,
        WikiComments,
        Relations,
        Article,
        Notice,
    },
    data() {
        return {
            source: "",
            wiki_post: "",
            compatible: false,
            is_empty: true,
        };
    },
    computed: {
        id() {
            return this.$route.params.source_id;
        },
        post_id: function () {
            return this.$route.params.post_id;
        },
        isRevision: function () {
            return !!this.$route.params.post_id;
        },
        author_id: function () {
            return ~~this.wiki_post.post.user_id;
        },
        client: function () {
            return this.$store.state.client;
        },
        user_name: function () {
            return this.wiki_post?.post?.user_nickname;
        },
        updated_at: function () {
            return ts2str(this.wiki_post?.post?.updated);
        },
        authors: function () {
            if (!this.isRevision) {
                return (
                    this.wiki_post?.users
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
        favTitle: function () {
            return this.wiki_post?.source?.Name;
        },
        prefix() {
            return this.client === "std" ? "www" : "origin";
        },
    },
    methods: {
        publish_url: publishLink,
        triggerStat: function () {
            if (this.client == "origin") {
                postStat("origin_cj", this.id);
            } else {
                postStat("cj", this.id);
            }
        },
        loadData: function () {
            // 获取最新攻略
            if (this.id) {
                get_achievement(this.id, { client: this.client }).then((res) => {
                    this.source = res?.data?.data?.achievement || "";
                });
                wiki.mix({ type: "achievement", id: this.id, client: this.client }).then((res) => {
                    const { post, source, compatible, isEmpty, users } = res;
                    this.wiki_post = {
                        post: post,
                        source: source,
                        users,
                    };
                    this.is_empty = isEmpty;
                    this.compatible = compatible;

                    reportNow({
                        caller: "cj_detail",
                        data: {
                            href: `${this.prefix}:/cj/view/${this.id}`,
                        },
                    });
                });
            }
            this.triggerStat();
        },
        loadRevision: function () {
            // 获取指定攻略
            wiki.getById(this.post_id).then((res) => {
                this.wiki_post = {
                    ...this.wiki_post,
                    post: res.data.data?.post,
                };
            });
            this.triggerStat();
        },
        ts2str,
    },
    watch: {
        id: {
            handler() {
                this.loadData();
            },
        },
        post_id: {
            handler() {
                this.loadRevision();
            },
        },
    },
    mounted: function () {
        if (this.post_id) {
            this.loadRevision();
        } else {
            this.loadData();
        }
    },
};
</script>

<style lang="less">
@import "~@/assets/css/cj/detail.less";
</style>
