<template>
    <div class="m-item-price-logs">
        <!-- 今日价格 -->
        <el-row class="m-today" v-if="currentPrice">
            <el-col :span="8">
                <div class="u-label">
                    <i class="el-icon-right u-avg"></i> {{ $t('今日均价') }}
                </div>
                <div class="u-value u-avg">
                    <GamePrice :price="currentPrice.AvgPrice" />
                </div>
            </el-col>
            <el-col :span="8">
                <div class="u-label">
                    <i class="el-icon-bottom u-min"></i> {{ $t('今日最低价') }}
                </div>
                <div class="u-value u-min">
                    <GamePrice :price="currentPrice.LowestPrice" />
                </div>
            </el-col>
            <el-col :span="8">
                <div class="u-label">
                    <i class="el-icon-top u-max"></i> {{ $t('今日最高价') }}
                </div>
                <div class="u-value u-max">
                    <GamePrice :price="currentPrice.HighestPrice" />
                </div>
            </el-col>
        </el-row>

        <div v-show="!hidden" id="m-item-price-chart" />
        <div v-show="!logs.length" style="text-align:center">🐖 {{ $t('暂无记录') }}</div>
    </div>
</template>

<script>
import { Chart } from "@antv/g2";
import {
    get_item_price_logs,
    get_item_servers_price_logs,
} from "@/service/item";
import GamePrice from "@jx3box/jx3box-common-ui/src/wiki/GamePrice.vue";

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
    computed: {
        currentPrice({ today, yesterday }) {
            return today || yesterday || null
        }
    },
    methods: {
        get_data() {
            if (this.item_id) {
                if (this.server) {
                    get_item_price_logs(this.item_id, {
                        server: this.server,
                    }).then((data) => {
                        data = data.data;
                        let output = [];
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
                        this.today = data.data.today;
                        this.yesterday = data.data.yesterday;
                        this.logs = output;
                        this.hidden = !(this.logs.length > 0);
                    });
                } else {
                    get_item_servers_price_logs(this.item_id).then((data) => {
                        data = data.data;
                        this.today = null;
                        this.yesterday = null;
                        this.logs = (data.data?.logs || []).map((item)=>{
                            return {
                                server: item.Server,
                                price: item.AvgPrice,
                                date: item.Date
                            }
                        });
                        this.hidden = !(this.logs.length > 0);
                    });
                }
            }
        },
        render() {
            if (!this.chart) {
                this.chart = new Chart({
                    container: "m-item-price-chart",
                    autoFit: true,
                    width: "100%",
                    height: 300,
                });
            }else{
                this.chart.clear();
            }

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
                        return this.$options.filters.item_price(val);
                    },
                },
            });

            this.chart.tooltip({
                showCrosshairs: true,
                shared: true,
                customItems: (items) => {
                    for (let index = 0; index < items.length; index++) {
                        items[index].value = this.$options.filters.item_price(
                            items[index].value
                        );
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
    watch: {
        item_id() {
            this.get_data();
        },
        server: {
            immediate: true,
            handler() {
                this.get_data();
            },
        },
        logs() {
            this.render();
        },
    },
    components: {
        GamePrice,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/item/item-price-logs.less";
</style>
