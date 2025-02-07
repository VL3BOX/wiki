<template>
    <div class="m-item-price-logs">
        <!-- 今日价格 -->
        <el-row class="m-today" v-if="today">
            <el-col :span="8">
                <div class="u-label"><i class="el-icon-right u-avg"></i> {{ $t('今日均价') }}</div>
                <div class="u-value u-avg">
                    <GamePrice :price="today.price" />
                </div>
            </el-col>
            <el-col :span="8">
                <div class="u-label"><i class="el-icon-bottom u-min"></i> {{ $t('今日最低价') }}</div>
                <div class="u-value u-min">
                    <GamePrice :price="today.min_price" />
                </div>
            </el-col>
            <el-col :span="8">
                <div class="u-label"><i class="el-icon-top u-max"></i> {{ $t('今日最高价') }}</div>
                <div class="u-value u-max">
                    <GamePrice :price="today.max_price" />
                </div>
            </el-col>
        </el-row>

        <!-- 昨日价格 -->
        <el-row class="m-today" v-if="!today && yesterday">
            <el-col :span="8">
                <div class="u-label"><i class="el-icon-right u-avg"></i> {{ $t('今日均价') }}</div>
                <div class="u-value u-avg">
                    <GamePrice :price="yesterday.price" />
                </div>
            </el-col>
            <el-col :span="8">
                <div class="u-label"><i class="el-icon-bottom u-min"></i> {{ $t('今日最低价') }}</div>
                <div class="u-value u-min">
                    <GamePrice :price="yesterday.min_price" />
                </div>
            </el-col>
            <el-col :span="8">
                <div class="u-label"><i class="el-icon-top u-max"></i> {{ $t('今日最高价') }}</div>
                <div class="u-value u-max">
                    <GamePrice :price="yesterday.max_price" />
                </div>
            </el-col>
        </el-row>

        <div v-show="!hidden" id="m-item-price-chart" />
        <div v-show="!logs.length" style="text-align: center">🐖 {{ $t('暂无记录') }}</div>
    </div>
</template>

<script>
import { Chart } from "@antv/g2";
import { get_item_servers_price_logs } from "@/service/item";
import GamePrice from "@/components/game-price.vue";
import item_price from "@/utils/item-price.js";

export default {
    name: "ItemPriceChart",
    props: ["item_id", "server"],
    data() {
        return {
            today: null,
            yesterday: null,
            logs: [],
            chart: null,
            hidden: false,
        };
    },
    methods: {
        get_data() {
            if (this.item_id) {
                get_item_servers_price_logs(this.item_id, {
                    server: this.server,
                }).then((data) => {
                    data = data.data;
                    let output = [];
                    if (this.server) {
                        for (let i in data.data.logs) {
                            let log = data.data.logs[i];
                            output.push({
                                date: log.Date,
                                price: log.AvgPrice,
                                type: "均价",
                            });
                            output.push({
                                date: log.Date,
                                price: log.LowestPrice,
                                type: "最低价",
                            });
                            output.push({
                                date: log.Date,
                                price: log.HighestPrice,
                                type: "最高价",
                            });
                        }
                    } else {
                        for (let i in data.data.logs) {
                            let log = data.data.logs[i];
                            output.push({
                                date: log.Date,
                                price: log.AvgPrice,
                                server: log.Server,
                            });
                        }
                    }
                    this.today = null;
                    this.yesterday = null;
                    this.logs = output;
                    this.render();
                    this.hidden = !(this.logs.length > 0);
                });
            }
        },
        render() {
            if (this.chart) this.chart.destroy();
            this.chart = new Chart({
                container: "m-item-price-chart",
                autoFit: true,
                width: "100%",
                height: 200,
            });

            this.chart.scale({
                date: {
                    range: [0, 1],
                },
                price: {
                    nice: true,
                },
            });

            this.chart.axis("price", {
                label: {
                    formatter: (val) => {
                        return item_price(val);
                    },
                },
            });

            this.chart.tooltip({
                showCrosshairs: true,
                shared: true,
                customItems: (items) => {
                    for (let index = 0; index < items.length; index++) {
                        items[index].value = item_price(items[index].value);
                    }
                    return items;
                },
            });

            this.chart
                .line()
                .position("date*price")
                .color(this.server ? "type" : "server")
                .shape("smooth");

            this.chart
                .point()
                .position("date*price")
                .color(this.server ? "type" : "server")
                .shape("circle");

            this.chart.data(this.logs);
            this.chart.render();
        },
    },
    computed: {
        params() {
            return [this.item_id, this.server];
        },
    },
    watch: {
        params: {
            deep: true,
            immediate: true,
            handler() {
                this.get_data();
            },
        },
    },
    components: {
        GamePrice,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/item/price-logs.less";
</style>
