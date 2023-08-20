<template>
    <div class="reward-item" :class="classes" v-if="display">
        <!-- 金钱 -->
        <template v-if="reward.type == 'money'"> 获得金钱：<game-price :price="reward.count"></game-price> </template>
        <template v-else-if="reward.type == 'exp'"> 获得阅历：{{ reward.count }} </template>
        <template v-else-if="reward.type == 'affect'">
            获得声望：{{ reward.force }}（{{ reward.count | affectNumber }}）
        </template>
        <point-reward v-else-if="reward.type == 'titlePoint'" :type="'titlePoint'" :value="`x ${reward.count}`">
        </point-reward>
        <point-reward v-else-if="reward.type == 'prestige'" :type="'prestige'" :value="`x ${reward.count}`">
        </point-reward>
        <point-reward v-else-if="reward.type == 'tongFund'" :type="'tongFund'" :value="`x ${reward.count}`">
        </point-reward>
        <point-reward v-else-if="reward.type == 'tongResource'" :type="'tongResource'" :value="`x ${reward.count}`">
        </point-reward>
        <point-reward v-else-if="reward.type == 'justice'" :type="'justice'" :value="`x ${reward.count}`">
        </point-reward>
        <point-reward v-else-if="reward.type == 'train'" :type="'train'" :value="`x ${reward.count}`"> </point-reward>
        <point-reward v-else-if="reward.type == 'vigor'" :type="'vigor'" :value="`x ${reward.count}`"> </point-reward>
        <point-reward
            v-else-if="reward.type == 'achievement'"
            :type="'achievement'"
            :value="reward.name"
            :icon="reward.icon"
            :id="reward.id"
        >
        </point-reward>
        <point-reward
            v-else-if="reward.type == 'skill'"
            :type="'skill'"
            :value="reward.name"
            :icon="reward.icon"
            :id="reward.id"
        >
        </point-reward>
        <template v-else-if="reward.type == 'item_group'">
            <p class="group-type">{{ reward | item_group_tips }}</p>
            <div class="item-list">
                <item-icon
                    v-for="(item, index) in reward.items"
                    :key="index"
                    :item_id="item.id"
                    :amount="item.amount"
                    :size="36"
                ></item-icon>
            </div>
        </template>
    </div>
</template>

<script>
import GamePrice from "@jx3box/jx3box-common-ui/src/wiki/GamePrice.vue";
import ItemIcon from "../common/item_icon.vue";
import PointReward from "./point_reward.vue";

export default {
    name: "RewardItem",
    props: {
        reward: {
            type: Object,
        },
    },
    components: {
        GamePrice,
        ItemIcon,
        PointReward,
    },
    data() {
        return {
            display: true,
        };
    },
    methods: {},
    computed: {
        classes() {
            return {
                "item-group": this.reward.type == "item_group",
                "gold-reward": this.reward.type == "money",
                "exp-reward": this.reward.type == "exp",
                "affect-reward": this.reward.type == "affect",
            };
        },
    },
    filters: {
        affectNumber: (count) => {
            if (count > 0) {
                return "+" + count;
            } else {
                return count;
            }
        },
        item_group_tips: (award) => {
            if (award.all) {
                if (award.bySchool) {
                    return "你将获得以下全部道具（根据门派）：";
                } else {
                    return "你将获得以下全部道具：";
                }
            } else {
                return "你可以在以下道具中选择一种：";
            }
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/quest/single/reward_item.less";
@import "~@jx3box/jx3box-editor/assets/css/module/item.less";
</style>
