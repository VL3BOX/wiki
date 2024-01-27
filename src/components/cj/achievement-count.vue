<template>
    <div class="m-achievement-count">
        <div class="u-stat">
            <span v-for="(text, key) in countDict" :key="key">
                <em>{{ text }}</em>
                <b>{{ count[key] }}</b>
            </span>
        </div>
    </div>
</template>
<script>
import { getAchievementsTotal } from "@/service/achievement";

export default {
    name: "AchievementCount",
    data() {
        return {
            count: {},
            countDict: {
                general: "常规成就数",
                general_point: "常规资历数",
                armor: "五甲成就数",
                armor_point: "五甲资历数",
                // post_count: "收录攻略数",
            },
        };
    },
    created() {
        // 获取成就统计信息
        getAchievementsTotal().then((data) => {
            data = data.data;
            this.count = data.data.count;
            const total = ~~this.count["general"] + ~~this.count["armor"];
            this.$store.commit("SET_STATE", { key: "achievementTotal", value: total });
        });
    },
};
</script>

<style lang="less">
@import "~@/assets/css/cj/achievement-count.less";
</style>
