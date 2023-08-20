<!--
 * @Author: iRuxu
 * @Date: 2022-07-09 19:40:42
 * @LastEditTime: 2022-07-12 14:57:34
 * @Description:
-->
<template>
    <div class="u-chain">
        <div class="list" v-if="showCurrent">
            <el-divider><i class="el-icon-connection"></i> 任务链</el-divider>
            <div class="u-chain-name" v-for="(item, i) in display_data.current" :key="item.id">
                <span v-if="item.logic !== undefined">
                    <span :class="{ all: item.logic, one: !item.logic }" v-for="b in item.quests" :key="b.id">
                        「<router-link
                            class="u-chain-link"
                            :class="{ current: current == b.id }"
                            :to="{ name: 'single', params: { quest_id: b.id } }"
                            >{{ b.name }}</router-link
                        >」
                    </span>
                </span>
                <span v-else>
                    「<router-link
                        class="u-chain-link"
                        :class="{ current: current == item.id }"
                        :to="{ name: 'single', params: { quest_id: item.id } }"
                        >{{ item.name }}</router-link
                    >」
                </span>
                <i v-if="i != display_data.current.length - 1" class="el-icon-d-arrow-right"></i>
            </div>
        </div>
        <div class="branch" v-if="showBranch">
            <el-divider><i class="el-icon-rank"></i> 任务分支</el-divider>
            <span class="u-chain-name" v-for="item in display_data.branch" :key="item.id">
                「<router-link class="u-chain-link" :to="{ name: 'single', params: { quest_id: item.id } }">{{
                    item.name
                }}</router-link
                >」
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: "QuestChain",
    props: {
        data: {
            type: Object,
        },
        current: {
            type: Number,
        },
    },
    computed: {
        display_data() {
            let current = this.data.current;
            if (current?.[0]?.id?.startsWith("b_")) {
                current[0].quests = current[0].quests.filter((item) => item.visible);
                if (current[0].quests.length == 1) {
                    current[0] = current[0].quests[0];
                }
            }
            current = current.filter((item) => item.hasOwnProperty("logic") || item.visible);
            let branch = this.data.branch.filter((item) => item.visible);
            if (branch && branch.length == 1) {
                current.push(...branch);
                branch = [];
            }
            return {
                current,
                branch,
            };
        },
        showBranch() {
            return this.display_data.branch.length > 0;
        },
        showCurrent() {
            return this.display_data.current.length > 1;
        },
    },
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/quest/single/quest_chain.less";
</style>
