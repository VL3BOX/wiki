<template>
    <Fragment>
        <!-- 头部导航 -->
        <header class="m-header">
            <a class="m-header-logo" :href="rootPath">
                <img class="u-logo" src="@/assets/img/logo.png" alt="JX3BOX" />
                <strong class="u-title">{{ $t('JX3BOX魔盒') }}</strong>
            </a>
            <ul class="m-header-list">
                <li><a :href="`${rootPath}macro/`">{{ $t('宏库') }}</a></li>
                <li><a :href="`${rootPath}bps/`">{{ $t('职业') }}</a></li>
                <li><a :href="`${rootPath}pvp/`">{{ $t('竞技') }}</a></li>
                <li><a :href="`${rootPath}fb/`">{{ $t('副本') }}</a></li>
                <li><a :href="`${rootPath}cj/`">{{ $t('百科') }}</a></li>
                <li><a :href="`${rootPath}pvx/`">{{ $t('休闲') }}</a></li>
                <li><a :href="`${rootPath}tool/`">{{ $t('工具') }}</a></li>
                <li><a :href="`${rootPath}bbs/`">{{ $t('茶馆') }}</a></li>
            </ul>
        </header>

        <!-- 主体区域 -->
        <main class="m-main">
            <div id="app">
                <slot></slot>
            </div>
        </main>

        <!-- 底部链接 -->
        <div class="m-footer">
            &copy; <a :href="rootPath">{{ $t('剑三魔盒') }}</a> [
            <a class="u-link" :href="rootPath">{{ rootDomain }}</a> ]
        </div>
    </Fragment>
</template>

<script>
import { Fragment } from 'vue-fragment'
import { __Root, __OriginRoot } from "@jx3box/jx3box-common/data/jx3box.json";

export default {
    name: "GameLayout",
    data: function() {
        return {
            params: new URLSearchParams(location.search),
        };
    },
    computed: {
        client: function () {
            let client = this.params.get("L") == "classic_yq" ? "origin" : "std";
            return client;
        },
        rootPath: function () {
            return this.client == "origin" ? __OriginRoot : __Root;
        },
        rootDomain: function() {
            return this.rootPath.replace(/^https?:\/\//ui, '').replace(/\/.*$/ui, '');
        },
    },
    components: {
        Fragment,
    },
};
</script>

<style lang="less">
//------ ⚠️预览用,发布前请注释 ------//
// html{
//     background:url('./assets/img/view.jpg') no-repeat 0 0;
//     width:802px;
//     height:572px;
//     padding:67px 3px 3px 4px;
//     box-sizing: border-box;
// }
// body{
//     height:100%;
//     background-color: rgba(255,255,255,1);
// }
//------ ⚠️预览用,发布前请注释 ------ //

@import "../assets/css/game/common.less";
@import "../assets/css/game/header.less";
@import "../assets/css/game/block.less";
@import "../assets/css/game/footer.less";
</style>
