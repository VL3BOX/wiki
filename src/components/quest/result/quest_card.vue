<template>
    <div class="m-quest-card" @click="go(quest.id)">
        <div class="u-map">{{ quest.map }}</div>
        <div class="u-name">
            <span class="u-name-title">
                <el-tooltip v-if="quest.questType == 'act'" :content="`该任务是活动任务`" placement="top">
                    <img class="u-name-type" src="@/assets/img/quest/quest_logo_purple.png" />
                </el-tooltip>
                <el-tooltip v-else-if="quest.questType == 'repeat'" :content="`该任务可重复完成`" placement="top">
                    <img class="u-name-type" src="@/assets/img/quest/quest_logo_blue.png" />
                </el-tooltip>
                <span class="u-name-text" :style="questNameColor">{{ quest.name }}</span>
                <el-tooltip
                    v-if="quest.schoolName"
                    :content="`该任务仅 ${quest.schoolName} 门派可接取`"
                    placement="top"
                >
                    <img class="u-name-school" :src="schoolIcon(quest.schoolName)" alt="" />
                </el-tooltip>
            </span>
            <span class="u-name-id">（ID：{{ quest.id }}）</span>
        </div>
        <div class="u-level">{{ quest.level }}</div>
        <div class="u-target">{{ quest.target }}</div>
        <div class="u-reward">
            <div class="u-reward-text__container">
                <span class="u-reward-text" v-for="reward in textReward" :key="reward.label + reward.data">
                    <span class="u-reward-label">{{ reward.label }}：</span>
                    <span class="u-reward-data">{{ reward.data }}</span>
                </span>
            </div>
            <div class="u-reward-item">
                <item-icon
                    v-for="(item, index) in items"
                    :key="index"
                    :item_id="item.id"
                    :amount="item.amount"
                    :onlyIcon="true"
                    :size="28"
                ></item-icon>
            </div>
        </div>
    </div>
</template>

<script>
import { schoolIcon, questTargetDescFormat } from "@/utils/quest";
import ItemIcon from "../common/item_icon.vue";

export default {
    name: "QuestCard",
    components: {
        ItemIcon,
    },
    props: {
        quest: {
            type: Object,
            required: true,
        },
    },
    methods: {
        go(id) {
            this.$router.push({ name: "single", params: { quest_id: id } });
        },
        schoolIcon,
        moneyFormat(price) {
            let z = "";
            let result = {
                zhuan: Math.floor(price * 0.01 * 0.01 * 0.0001) || 0,
                jin: Math.floor((price * 0.01 * 0.01) % 10000) || 0,
                yin: Math.floor((price * 0.01) % 100) || 0,
                tong: Math.floor(price % 100) || 0,
            };
            if (result["zhuan"]) z += `${result["zhuan"]}砖`;
            if (result["jin"]) z += `${result["jin"]}金`;
            if (result["yin"]) z += `${result["yin"]}银`;
            if (result["tong"]) z += `${result["tong"]}铜`;
            return `${z}`;
        },
    },
    computed: {
        targetFormatted() {
            return questTargetDescFormat(this.quest.desc?.Objective);
        },
        items() {
            if (!this.quest.reward || this.quest.reward.length == 0) {
                return [];
            }
            let rewards = this.quest.reward.filter((i) => i.type == "item_group");
            let items = [];
            for (let reward of rewards) items.push(...reward.items);
            return items.slice(0, 7);
        },
        questNameColor() {
            let map = {
                common: "#0d0e0d",
                repeat: "#0366d6",
                act: "#7632ff",
            };
            return {
                color: map[this.quest.questType],
            };
        },
        textReward() {
            let rewards = this.quest.reward.filter((i) => i.type != "item_group");
            let textRewards = [];
            let rewardName = {
                money: "金钱",
                exp: "阅历",
                justice: "侠行点",
                prestige: "威名点",
                tongFund: "帮会资金",
                vigor: "精力",
                tongResource: "载具资源",
                affect: "声望",
                achievement: "成就",
                train: "修为",
            };
            for (let r of rewards) {
                let data = r.count;
                if (r.type == "money") {
                    data = this.moneyFormat(data);
                } else if (r.type == "affect") {
                    data = `${r.force}${r.count > 0 ? "+" : ""}${r.count}`;
                }
                textRewards.push({
                    label: rewardName[r.type],
                    data,
                });
            }
            return textRewards;
        },
    },
};
</script>
<style lang="less" scoped>
@import "~@/assets/css/quest/result/quest_card.less";
</style>
