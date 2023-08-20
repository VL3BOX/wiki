<template>
    <div class="m-quest-carousel">
        <el-carousel height="66px" direction="vertical" :interval="3500" indicator-position="none">
            <el-carousel-item
                v-for="(items, key) in chunkedQuests"
                :key="key"
                class="m-carousel"
                :class="{ 'm-hot': hot }"
            >
                <el-row :gutter="20">
                    <el-col :md="8" v-for="(item, k) in items" :key="k">
                        <router-link
                            class="u-item"
                            :class="{
                                [`u-item-${k}`]: true,
                                'u-item-new': !hot,
                            }"
                            :to="{
                                name: 'single',
                                params: { quest_id: item.id },
                            }"
                        >
                            <div class="m-carousel-content">
                                <span class="u-title">
                                    <i class="el-icon-aim"></i>
                                    <span v-text="` ${item.name}`"></span>
                                </span>
                                <span class="u-desc">
                                    <i class="el-icon-mic"></i>
                                    <span v-html="` ${item.target}`"></span>
                                </span>
                                <span class="u-rank" v-if="views && views[item.id]">
                                    <i class="el-icon-watermelon"></i>
                                    <span v-text="`昨日 - ${views[item.id]['yesterday']}`"></span>
                                    <i class="el-icon-grape"></i>
                                    <span v-text="`七天 - ${views[item.id]['7days']}`"></span>
                                    <i class="el-icon-pear"></i>
                                    <span v-text="`三十天 - ${views[item.id]['30days']}`"></span>
                                </span>
                            </div>
                        </router-link>
                    </el-col>
                </el-row>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
import { chunk } from "lodash";
export default {
    name: "QuestCarousel",
    props: {
        quests: {
            type: Array,
            default: () => [],
        },
        views: {
            type: Object,
            default: () => {},
        },
        hot: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        chunkedQuests: [],
    }),
    watch: {
        quests: {
            immediate: true,
            handler() {
                this.chunkedQuests = chunk(this.quests, 3);
            },
        },
    },
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/quest/home/quest_carousel.less";
</style>
