<!--
 * @Author: X3ZvaWQ
 * @Date: 2022-07-11 00:14:57
 * @LastEditors: X3ZvaWQ
 * @LastEditTime: 2022-07-12 12:52:34
 * @Description: 抽离出来的三个页面都有用到的搜索框
-->
<template>
    <div class="m-search-input">
        <el-input
            placeholder="输入任务关键字（可包括中括号），「回车」进行搜索"
            v-model="keyword"
            @keyup.enter.native="search"
        >
            <span slot="prepend">
                <el-tooltip content="查看任务链需要键入完整任务名或任务ID哦" placement="top">
                    <el-checkbox v-model="chain">查看任务链</el-checkbox>
                </el-tooltip>
            </span>
            <el-button @click="search" slot="append">
                <div class="u-input-button__normal">
                    <i class="el-icon-position"></i>
                    <span>搜索</span>
                </div>
                <span class="u-input-button__small"><i class="xs el-icon-search"></i></span>
            </el-button>
        </el-input>
        <el-tooltip class="u-tips" effect="dark" placement="bottom">
            <div slot="content">
                <span>※ 支持任务名称精确或模糊搜索</span> <br />
                <span>※ 支持任务相关物品名称精确搜索</span> <br />
                <span>※ 支持成就名称精确搜索</span> <br />
            </div>
            <el-button type="text" icon="el-icon-question"></el-button>
        </el-tooltip>
        <el-popover popper-class="u-player-setting-popover" placement="top" width="160" v-model="settingVisible">
            <el-input v-model="playerName" placeholder="称呼" @input="handlePlayerInfoChange"></el-input>
            <el-input v-model="playerBody" placeholder="体型" @input="handlePlayerInfoChange"></el-input>
            <div style="text-align: right; margin: 0">
                <el-button type="primary" size="mini" @click="settingVisible = false">确定</el-button>
            </div>
            <div class="u-player" slot="reference">
                <span class="u-player-name">{{ playerName }} </span>
                <span class="u-player-body">{{ playerBody }}</span>
                <el-button type="text" icon="el-icon-setting"></el-button>
            </div>
        </el-popover>
    </div>
</template>

<script>
import { getPlayerName } from "@/utils/quest";
export default {
    name: "SearchInput",
    data() {
        return {
            keyword: "",
            chain: false,

            settingVisible: false,
            playerName: "侠士",
            playerBody: "少侠",
        };
    },
    methods: {
        search(go) {
            if (!go) return;
            this.$router.push({
                name: "result",
                query: { keyword: this.keyword, chain: this.chain },
            });
        },
        handlePlayerInfoChange() {
            localStorage.setItem("QuestWiki:playerName", this.playerName);
            localStorage.setItem("QuestWiki:playerBody", this.playerBody);
        },
    },
    mounted() {
        const { playerName, playerBody } = getPlayerName();
        this.playerName = playerName;
        this.playerBody = playerBody;
    },
};
</script>

<style lang="less">
@import "~@/assets/css/quest/common/search_input.less";
</style>
