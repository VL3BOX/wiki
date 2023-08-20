<!--
 * @Author: iRuxu
 * @Date: 2022-07-09 19:40:42
 * @LastEditTime: 2022-07-12 13:44:14
 * @Description:
-->
<template>
    <div class="m-quest-home">
        <!-- 头部大标题 -->
        <!-- <img class="u-logo" src="@/assets/img/quest/quest_logo.png" alt="" /> -->
        <!-- <h1 class="u-title">任务百科</h1> -->
        <!-- 通用输入框 -->
        <search-input></search-input>
        <wiki-panel :border-none="true">
            <template slot="head-title">
                <i class="el-icon-location-information"></i>
                <span>便捷入口</span>
            </template>
            <template slot="head-actions">
                <a class="other" target="_blank" :href="feedback">反馈建议 &raquo;</a>
            </template>
            <template slot="body">
                <ul class="u-qlinks">
                    <li class="u-qlink">
                        <a style="background-color: #fe7979" target="_blank" href="/tool/9126/">
                            <i class="el-icon-trophy"></i>
                            <span>游戏内看百科</span>
                        </a>
                    </li>
                    <li class="u-qlink">
                        <router-link :to="{ name: 'waiting' }">
                            <i class="el-icon-edit-outline"></i>
                            <span>待攻略任务</span>
                            <span class="u-waiting" :style="waitingColorStyle()">（{{ solveRate.toFixed(2) }}%）</span>
                        </router-link>
                    </li>
                </ul>
            </template>
        </wiki-panel>
        <wiki-panel :border-none="true">
            <template slot="head-title">
                <i class="el-icon-notebook-1"></i>
                <span>热门任务</span>
            </template>
            <template slot="body">
                <quest-carousel :quests="hotQuests" :views="hotViews" :hot="true"></quest-carousel>
            </template>
        </wiki-panel>
        <wiki-panel :border-none="true">
            <template slot="head-title">
                <i class="el-icon-notebook-2"></i>
                <span>最新任务</span>
            </template>
            <template slot="head-actions">
                <router-link class="other" :to="{ name: 'newest' }">查看更多 &raquo;</router-link>
            </template>
            <template slot="body">
                <quest-carousel :quests="newestQuests"></quest-carousel>
            </template>
        </wiki-panel>
        <wiki-panel :border-none="true">
            <template slot="head-title">
                <i class="el-icon-collection"></i>
                <span>最新攻略</span>
            </template>
            <newest-post slot="body"></newest-post>
        </wiki-panel>
    </div>
</template>

<script>
import SearchInput from "@/components/quest/common/search_input.vue";
import WikiPanel from "@jx3box/jx3box-common-ui/src/wiki/WikiPanel";
import NewestPost from "@/components/quest/home/newest_post.vue";
import QuestCarousel from "@/components/quest/home/quest_carousel.vue";

import { getQuests, getNewestQuests, getWaitingRate } from "@/service/quest";
import { feedback } from "@jx3box/jx3box-common/data/jx3box.json";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import { getStatRank } from "@jx3box/jx3box-common/js/stat";

export default {
    name: "Home",
    components: { SearchInput, NewestPost, QuestCarousel, WikiPanel },
    data: () => ({
        by: "all",
        feedback,

        newestQuests: [],

        hotQuests: [],
        hotViews: {},

        solveRate: 0,
    }),
    computed: {
        client() {
            return this.$store.state.client;
        },
    },
    methods: {
        async getNewestData(page = 1) {
            let params = {
                page,
                pageSize: 12,
                client: this.client,
            };
            getNewestQuests(params).then((res) => {
                this.newestQuests = res.data.list;
            });
        },
        async getHotData() {
            const key = this.client == "origin" ? "origin_quest" : "quest";
            getStatRank(key, "views", 12).then((res) => {
                res = res.data;
                let source_ids = [];
                for (let item of res) {
                    let source_id = item.name.split("-")?.pop();
                    source_ids.push(source_id);
                    this.hotViews[source_id] = item.value;
                }
                getQuests({
                    ids: source_ids.join(","),
                    client: this.client,
                }).then((res) => {
                    this.hotQuests = res.data;
                });
            });
        },
        async getWaiting() {
            getWaitingRate({ client: this.client }).then((res) => {
                let { wiki_count: solve, source_count: all } = res.data.data ?? {};
                this.solveRate = (solve / all) * 100;
            });
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
        iconLink,
    },
    mounted() {
        this.getNewestData();
        this.getHotData();
        this.getWaiting();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/quest/home.less";
</style>
