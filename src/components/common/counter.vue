<template>
    <router-link :to="{ name: 'waiting' }">
        <i class="el-icon-edit-outline"></i>
        <span>待攻略{{ name }}</span>
        <span class="u-waiting" :style="waitingColorStyle()">（{{ solveRate.toFixed(2) }}%）</span>
    </router-link>
</template>

<script>
// 待攻略
import { wiki } from "@jx3box/jx3box-common/js/wiki_v2";
import { getWaitingRate } from "@/service/quest";
export default {
    name: "WikiCounter",
    props: {
        type: {
            type: String,
            default: "achievement",
        },
    },
    data() {
        return {
            solveRate: 0,
        };
    },
    computed: {
        name() {
            let name = "成就";
            if (this.type === "item") {
                name = "物品";
            }
            if (this.type === "quest") {
                name = "任务";
            }
            return name;
        },
    },
    methods: {
        waitingColorStyle() {
            if (this.solveRate > 95) {
                return "color: #8dfa58";
            } else if (this.solveRate > 60) {
                return "color: #e2d849";
            } else {
                return "color: #ff3838";
            }
        },
        async getWaiting() {
            getWaitingRate({ client: this.client }).then((res) => {
                let { wiki_count: solve, source_count: all } = res.data.data ?? {};
                this.solveRate = (solve / all) * 100;
            });
        },
    },
    mounted() {
        // 完成率
        if (this.type === "quest") {
            this.getWaiting();
        } else {
            wiki.counter({ type: this.type }).then((res) => {
                let { wiki_count: solve, source_count: all } = res.data.data ?? {};
                this.solveRate = (solve / all) * 100;
            });
        }
    },
};
</script>

<style lang="less"></style>
