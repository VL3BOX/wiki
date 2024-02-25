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
        const { t } = this.$i18n;
        return {
            generalNum: 137, // 和游戏差异，固定加上
            count: {},
            countDict: {
                general: t('常规成就数'),
                general_point: t('常规资历数'),
                armor: t('五甲成就数'),
                armor_point: t('五甲资历数'),
                // post_count: t("收录攻略数"),
            },
        };
    },
    created() {
        // 获取成就统计信息
        getAchievementsTotal().then((data) => {
            data = data.data;
            this.count = data.data.count;
            this.count.general = ~~this.count?.general + this.generalNum;
            this.$store.commit("SET_STATE", { key: "generalTotal", value: ~~this.count["general"] });
            this.$store.commit("SET_STATE", { key: "armorTotal", value: ~~this.count["armor"] });
        });
    },
};
</script>

<style lang="less">
@import "~@/assets/css/cj/achievement-count.less";
</style>
