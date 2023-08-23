<template>
    <div class="m-home-view">
        <Search />

        <WikiPanel :border-none="true">
            <template slot="head-title">
                <i class="el-icon-location-information"></i>
                <span>便捷入口</span>
            </template>
            <template slot="head-actions">
                <a class="u-more" target="_blank" :href="feedback">反馈建议 &raquo;</a>
            </template>
            <template slot="body">
                <ul class="m-qlinks">
                    <li class="qlink">
                        <a style="background-color: #fe7979" target="_blank" href="/tool/18151/">
                            <i class="el-icon-trophy"></i>
                            <span>游戏内看百科</span>
                        </a>
                    </li>
                    <li class="qlink">
                        <router-link :to="{ name: 'waiting' }">
                            <i class="el-icon-edit-outline"></i>
                            <span>待攻略物品</span>
                            <span class="u-waiting" :style="waitingColorStyle()">（{{ solveRate.toFixed(2) }}%）</span>
                        </router-link>
                    </li>
                    <!-- <li class="qlink">
                        <router-link :to="{ name: 'plan_list' }">
                            <i class="el-icon-document"></i>
                            物品清单
                        </router-link>
                    </li> -->
                    <li class="qlink">
                        <router-link
                            :to="{
                                name: 'search',
                                query: {
                                    ids: '5_24423,5_24424,5_24425,5_24426,5_24427,5_24428,5_24429,5_24430',
                                },
                            }"
                        >
                            <i class="el-icon-cherry"></i>
                            <span>五行石合成</span>
                        </router-link>
                    </li>
                    <li class="qlink">
                        <a target="_blank" href="/pvg/manufacture">
                            <i class="el-icon-magic-stick"></i>
                            <span>技艺助手</span>
                        </a>
                    </li>
                    <li class="qlink">
                        <a target="_blank" href="/app/price">
                            <i class="el-icon-orange"></i>
                            <span>金价走势</span>
                        </a>
                    </li>
                    <li class="qlink">
                        <a target="_blank" href="/pvg/item_price">
                            <i class="el-icon-orange"></i>
                            <span>物价大全</span>
                        </a>
                    </li>
                </ul>
            </template>
        </WikiPanel>

        <WikiPanel :border-none="true">
            <template slot="head-title">
                <i class="el-icon-notebook-1"></i>
                <span>最新物品</span>
            </template>
            <!-- <template slot="head-actions">
                <a href="pvg/item_price" target="_blank" class="u-more">查看更多 &raquo;</a>
            </template> -->
            <template slot="body">
                <div class="m-plan-list">
                    <el-carousel
                        height="86px"
                        direction="vertical"
                        indicator-position="none"
                        v-if="new_plans && new_plans.length"
                    >
                        <el-carousel-item
                            v-for="(items, key) in new_plans"
                            :key="key"
                            class="m-carousel m-carousel-hot"
                        >
                            <el-row :gutter="20">
                                <template v-for="(item, k) in items">
                                    <el-col :md="8" v-if="item" :key="k">
                                        <router-link class="u-item" :class="`u-item-${k}`" :to="'/view/' + item.id">
                                            <div class="u-icon">
                                                <img :src="icon_url(item.IconID)" />
                                            </div>
                                            <div class="u-content">
                                                <span class="u-name">
                                                    <span v-text="item.Name"></span>
                                                </span>
                                                <game-text
                                                    class="u-desc"
                                                    :text="item.Desc ? item.Desc : '该物品没有描述'"
                                                    :client="client"
                                                ></game-text>
                                            </div>
                                        </router-link>
                                    </el-col>
                                </template>
                            </el-row>
                        </el-carousel-item>
                    </el-carousel>
                    <div v-else style="text-align: center">😂 暂无物品清单</div>
                </div>
            </template>
        </WikiPanel>

        <WikiPanel :border-none="true">
            <template slot="head-title">
                <i class="el-icon-notebook-1"></i>
                <span>最热物品</span>
            </template>
            <!-- <template slot="head-actions">
                <router-link :to="{ name: 'plan_list' }" class="u-more">查看更多 &raquo;</router-link>
            </template> -->
            <template slot="body">
                <div class="m-plan-list">
                    <el-carousel
                        height="86px"
                        direction="vertical"
                        indicator-position="none"
                        v-if="hot_plans && hot_plans.length"
                    >
                        <el-carousel-item
                            v-for="(items, key) in hot_plans"
                            :key="key"
                            class="m-carousel m-carousel-hot"
                        >
                            <el-row :gutter="20">
                                <template v-for="(item, k) in items">
                                    <el-col :md="8" v-if="item" :key="k">
                                        <router-link class="u-item" :class="`u-item-${k}`" :to="'/view/' + item.id">
                                            <div class="u-icon">
                                                <img :src="icon_url(item.IconID)" />
                                            </div>
                                            <div class="u-content">
                                                <span class="u-name">
                                                    <span v-text="item.Name"></span>
                                                </span>
                                                <game-text
                                                    class="u-desc"
                                                    :text="item.Desc ? item.Desc : '该物品没有描述'"
                                                    :client="client"
                                                ></game-text>
                                            </div>
                                        </router-link>
                                    </el-col>
                                </template>
                            </el-row>
                        </el-carousel-item>
                    </el-carousel>
                    <div v-else style="text-align: center">😂 暂无物品清单</div>
                </div>
            </template>
        </WikiPanel>

        <WikiPanel :border-none="true">
            <template slot="head-title">
                <i class="el-icon-collection"></i>
                <span>最新攻略</span>
            </template>
            <template slot="body">
                <div class="wiki-post-list" v-if="newest_posts.length">
                    <div class="wiki-post" v-for="(post, key) in newest_posts" :key="key">
                        <div class="m-about-post">
                            <div class="m-wiki">
                                <div class="u-wiki">
                                    <img
                                        class="u-icon"
                                        :src="icon_url(post.source_icon_id)"
                                        @error.once="$event.target.src = icon_url()"
                                    />
                                    <router-link
                                        class="u-name"
                                        :to="{
                                            name: 'view',
                                            params: { item_id: post.source_id },
                                        }"
                                        target="_blank"
                                    >
                                        <span v-text="post.title"></span>
                                    </router-link>
                                </div>
                                <div class="u-level" v-text="'综合难度：' + star(post.level)"></div>
                                <div class="u-remark" v-if="post.remark" v-text="'📑 ' + post.remark"></div>
                            </div>
                            <div class="m-user">
                                <div class="u-author">
                                    <img class="u-icon" :src="showAvatar(post.user_avatar)" :alt="post.user_nickname" />
                                    <a
                                        :href="post.user_id | author_url"
                                        class="u-name"
                                        v-text="post.user_nickname"
                                        v-if="post.user_id"
                                        target="_blank"
                                    ></a>
                                    <span v-else class="u-name">{{ post.user_nickname }}</span>
                                </div>
                                <div class="u-updated" v-text="date_format(post.updated)"></div>
                            </div>
                        </div>
                        <div class="m-excerpt">
                            <router-link
                                class="u-excerpt"
                                :to="{
                                    name: 'view',
                                    params: { item_id: post.source_id },
                                }"
                                ><span v-html="ellipsis(post.excerpt)"></span
                            ></router-link>
                        </div>
                    </div>
                </div>
                <div v-else style="text-align: center">😂 暂无攻略</div>
            </template>
        </WikiPanel>
    </div>
</template>

<script>
import WikiPanel from "@jx3box/jx3box-common-ui/src/wiki/WikiPanel";
import Search from "@/components/item/Search.vue";
import { iconLink, getThumbnail } from "@jx3box/jx3box-common/js/utils";
import { get_item_posts, get_newest_items, get_items_by_node, get_waiting_rate } from "@/service/item.js";
import { getStatRank } from "@jx3box/jx3box-common/js/stat";
import { __iconPath, feedback, default_avatar } from "@jx3box/jx3box-common/data/jx3box.json";
import { date_format, star } from "@/filters";
import GameText from "@jx3box/jx3box-editor/src/GameText.vue";
import { chunk } from "lodash";
export default {
    name: "Home",
    data() {
        return {
            newest_posts: [],
            new_plans: [],
            hot_plans: [],
            feedback: feedback,
            plan_2_icon: __iconPath + "icon/2410.png",
            plan_1_icon: __iconPath + "icon/3089.png",
            solveRate: 0,
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
    },
    components: {
        Search,
        WikiPanel,
        GameText,
    },
    methods: {
        icon_url: function (id) {
            return iconLink(id, this.client);
        },
        ellipsis(value) {
            value = value ? value.trim() : "";
            if (value.length > 100) {
                return value.slice(0, 100) + "...";
            }
            return value;
        },
        date_format,
        star,

        showAvatar: function (val) {
            return (val && getThumbnail(val, 20, true)) || getThumbnail(default_avatar, 20, true);
        },
        showItemTrending: function (item) {
            if (item.sub_days_0_price && item.sub_days_1_price) {
                if (item.sub_days_0_price - item.sub_days_1_price > 0) {
                    return "▲";
                } else if (item.sub_days_0_price - item.sub_days_1_price < 0) {
                    return "▼";
                } else {
                    return "";
                }
            }
        },
        showItemTrendingClass: function (item) {
            if (item.sub_days_0_price && item.sub_days_1_price) {
                if (item.sub_days_0_price - item.sub_days_1_price > 0) {
                    return "up";
                } else if (item.sub_days_0_price - item.sub_days_1_price < 0) {
                    return "down";
                } else {
                    return "keep";
                }
            }
        },
        waitingColorStyle() {
            if (this.solveRate > 95) {
                return "color: #8dfa58";
            } else if (this.solveRate > 60) {
                return "color: #e2d849";
            } else {
                return "color: #ff3838";
            }
        },
    },
    created() {
        get_item_posts().then((res) => {
            res = res.data;
            this.newest_posts = res.data.newest;
        });
        // 获取最新物品
        get_newest_items({ client: this.client }).then((res) => {
            this.new_plans = chunk(res.data, 3);
        });
        // 获取最热物品，先调stat接口获得物品ID之后调用node的items接口
        getStatRank("item", "views", 15)
            .then((res) => {
                let ids = res.data
                    .map((item) => item?.name?.match(/item-(\d+_\d+)/) && item.name?.replace(/item-(\d+_\d+)/, "$1"))
                    .filter((item) => item);
                get_items_by_node({ ids, client: this.client, per: 15 }).then((res) => {
                    this.hot_plans = chunk(res.data?.list, 3);
                });
            })
            .catch((err) => {
                console.log(err);
            });
        get_waiting_rate({ client: this.client }).then((res) => {
            let { wiki_count: solve, source_count: all } = res.data.data ?? {};
            this.solveRate = (solve / all) * 100;
        });
    },
};
</script>

<style lang="less">
@import "~@/assets/css/item/home.less";
</style>
