<template>
    <WikiPanel border-none="true" class="m-search-hottest m-price-header">
        <template slot="head-title">
            <div class="u-title">
                <i class="el-icon-shopping-bag-1"></i>
                <span>交易趋势</span>
            </div>
            <el-select class="u-server" v-model="server" placeholder="请选择服务器" size="mini">
                <el-option v-for="serve in servers" :key="serve" :label="serve" :value="serve"></el-option>
            </el-select>
        </template>
        <template slot="head-actions">
            <el-input
                class="u-search"
                placeholder="搜索.."
                v-model="search"
                size="mini"
                @keyup.enter.native="goItemPage"
            >
                <el-button slot="append" icon="el-icon-search" @click="goItemPage"></el-button>
            </el-input>
        </template>
        <div slot="body" class="m-index-price">
            <div class="m-price-list" v-if="groups && groups.length && isEmpty">
                <!-- <div v-for="i in 2" :key="'wrapper' + i"> -->
                <el-row :gutter="20" v-for="(group, key) in groups" :key="key">
                    <div :span="24" class="u-group-title" v-text="group.label"></div>
                    <el-col :span="6" v-for="(item, k) in group.items" :key="k">
                        <router-link
                            v-if="item"
                            class="u-item"
                            :class="`u-item-${key}`"
                            :to="{name:'view',params: {item_id: item.item_id}}"
                        >
                            <div class="u-icon">
                                <img :src="icon_url(item.icon)" />
                            </div>
                            <div class="u-content">
                                <span class="u-name">
                                    <span v-text="item.label"></span>
                                </span>
                                <span class="u-price">
                                    <span
                                        class="u-trending"
                                        :class="item | showItemTrendingClass"
                                    >{{item | showItemTrending}}</span>
                                    <template v-if="item.sub_days_0_price">
                                        <span>今日：</span>
                                        <GamePrice :price="item.sub_days_0_price" />
                                    </template>
                                    <template
                                        v-else-if="!item.sub_days_0_price && item.sub_days_1_price"
                                    >
                                        <span>昨日：</span>
                                        <GamePrice :price="item.sub_days_1_price" />
                                    </template>
                                    <template
                                        v-else-if="!item.sub_days_0_price && !item.sub_days_1_price && item.sub_days_2_price"
                                    >
                                        <span>前日：</span>
                                        <GamePrice :price="item.sub_days_2_price" />
                                    </template>
                                    <span v-else>暂无价目</span>
                                </span>
                            </div>
                        </router-link>
                    </el-col>
                </el-row>
                <!-- </div> -->
            </div>
            <!-- <div v-else style="text-align:center">😂 暂无数据</div> -->
            <!-- <div class="m-transaction-box" v-loading="loading">
                <div class="m-price-list" v-if="groups && groups.length">
                    <el-carousel
                        indicator-position="none"
                        :autoplay="true"
                        :interval="3000"
                        height="200px"
                        direction="vertical"
                    >
                        <el-carousel-item v-for="(group, key) in groups" :key="key">
                            <el-row :gutter="20">
                                <el-col :span="6" v-for="(item, k) in group.items" :key="k">
                                    <a
                                        v-if="item"
                                        class="u-item"
                                        :class="`u-item-${key}`"
                                        :href="item.item_id | showItemLink"
                                        target="_blank"
                                    >
                                        <div class="u-icon">
                                            <img :src="item.icon | iconLink" />
                                        </div>
                                        <div class="u-content">
                                            <span class="u-name">
                                                <span v-text="item.label"></span>
                                            </span>
                                            <span class="u-price">
                                                <span
                                                    class="u-trending"
                                                    :class="item | showItemTrendingClass"
                                                >{{item | showItemTrending}}</span>
                                                <template v-if="item.sub_days_0_price">
                                                    <GamePrice :price="item.sub_days_0_price" />
                                                </template>
                                                <template
                                                    v-else-if="!item.sub_days_0_price && item.sub_days_1_price"
                                                >
                                                    <GamePrice :price="item.sub_days_1_price" />
                                                </template>
                                                <template
                                                    v-else-if="!item.sub_days_0_price && !item.sub_days_1_price && item.sub_days_2_price"
                                                >
                                                    <GamePrice :price="item.sub_days_2_price" />
                                                </template>
                                                <span v-else>暂无价目</span>
                                            </span>
                                        </div>
                                    </a>
                                </el-col>
                            </el-row>
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>-->
        </div>
    </WikiPanel>
</template>

<script>
import WikiPanel from "@/components/wiki-panel.vue";
import { get_item_groups_with_price } from "@/service/item-group";
import servers_origin from "@jx3box/jx3box-data/data/server/server_origin.json";
import servers_std from "@jx3box/jx3box-data/data/server/server_std.json";
import GamePrice from "@jx3box/jx3box-common-ui/src/wiki/GamePrice.vue";
import { getProfile } from "@/service/user";
import User from "@jx3box/jx3box-common/js/user";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "StarMarkItems",
    data() {
        return {
            groups: [],
            server: "",
            loading: false,
            search: "",
        };
    },
    computed: {
        item_ids: function () {
            return this.$store.state.client == "origin"
                ? ["origin1", "origin2", "origin3"]
                : ["index1", "index2", "teshucailiao"];
        },
        servers: function () {
            return this.$store.state.client == "origin"
                ? servers_origin
                : servers_std;
        },
        client: function() {
            return this.$store.state.client;
        },
        isEmpty: function() {
            return this.groups.some(item => item);
        }
    },
    components: {
        WikiPanel,
        GamePrice,
    },
    methods: {
        // 获取星标物品
        get_data() {
            if (!this.server) return;

            this.loading = true;
            get_item_groups_with_price({
                server: this.server,
                keys: this.item_ids.join(","),
            })
                .then((data) => {
                    data = data.data;
                    this.groups = Object.values(data.data) || [];
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        goItemPage: function () {
            let host = location.origin;
            window.open(
                `${host}/item/#/search/${this.search}?page=1`,
                "_blank"
            );
        },
        icon_url: function(id) {
            return iconLink(id, this.client);
        },
    },
    watch: {
        server: {
            immediate: true,
            handler() {
                this.get_data();
            },
        },
    },
    mounted: function () {
        if (User.isLogin() && this.$store.state.client == "std") {
            getProfile().then((data) => {
                if (data) {
                    this.server = data.jx3_server || "斗转星移";
                }
            });
        } else {
            this.server =
                this.$store.state.client == "origin" ? "缘起稻香" : "斗转星移";
        }
    },
    filters: {
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
        iconLink,
        showItemLink: function (val) {
            return `/item/#/view/${val}`;
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/item/price-slider.less";
</style>
