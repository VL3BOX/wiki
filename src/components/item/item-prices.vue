<template>
    <div class="m-item-prices">
        <table v-if="prices.length" v-loading="priceLoading">
            <tr>
                <th>{{ $t('物品') }}</th>
                <th>{{ $t('等级') }}</th>
                <th>{{ $t('上传时间') }}</th>
                <th>{{ $t('服务器') }}</th>
                <th style="text-align: right">{{ $t('一口价 (总价)') }}</th>
                <th style="text-align: right">{{ $t('一口价 (单价)') }}</th>
            </tr>
            <tr v-for="(price, key) in prices" :key="key">
                <td>
                    <div class="m-item-icon">
                        <img class="u-icon" :src="icon_url(item && item.IconID)" />
                        <span class="u-count" v-if="price.n_count > 1" v-text="price.n_count"></span>
                    </div>
                    <span
                        class="u-name"
                        v-text="item.Name"
                        :class="{ white: item.Quality == 1 }"
                        :style="{
                            color: item_color(item.Quality),
                        }"
                    ></span>
                </td>
                <td v-text="item && item.RequireLevel ? item.RequireLevel : 1"></td>
                <td v-text="dayjs(price.created*1000).format('YYYY-MM-DD HH:mm:ss')"></td>
                <td v-text="price.server"></td>
                <td style="text-align: right" v-text="item_price(price.n_money)"></td>
                <td style="text-align: right" v-text="item_price(price.unit_price)"></td>
            </tr>
        </table>

        <div v-else style="text-align: center">🐖 {{ $t('暂无记录') }}</div>
    </div>
</template>

<script>
import { get_item, get_item_prices } from "@/service/item";
import { item_price, date_format, item_color } from "@/filters";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import dayjs from "dayjs";

export default {
    name: "ItemPrices",
    props: ["item_id", "server"],
    data() {
        return {
            item: null,
            prices: [],
            priceLoading: false,
        };
    },
    computed: {
        client: function() {
            return this.$store.state.client;
        },
    },
    methods: {
        dayjs,
        get_data() {
            if (this.item_id) {
                this.priceLoading = true;
                get_item_prices(this.item_id, {
                    server: this.server,
                    limit: 15,
                }).then((data) => {
                    this.priceLoading = false;
                    data = data.data;
                    this.prices = data.data.prices.sort((a,b)=> a.created + b.created) || [];
                });
                // 获取物品信息
                get_item(this.item_id).then((data) => {
                    data = data.data;
                    this.item = data.data.item;
                });

            }
        },
        icon_url: function(id) {
            return iconLink(id, this.client);
        },
        item_price,
        date_format,
        item_color,
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
    },
};
</script>

<style lang="less">
@import "~@/assets/css/item/item-prices.less";
</style>
