<template>
    <div class="c-wiki-nav">
        <Menu class="c-wiki-menu"></Menu>
        <div class="c-nav-content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import Menu from "@/components/common/menu.vue";
export default {
    name: "CommonNav",
    components: {
        Menu,
    },
};
</script>

<style lang="less">
.c-wiki-nav {
    position: relative;
    .flex;
    height: 100%;
    width: 100%;
    @w: 18px;
    .c-wiki-menu {
        position: relative;
        height: 100%;
        width: calc(@w + 10px);
        margin-right: 10px;
        .m-menus {
            position: fixed;
            top: 10px;
            .flex;
            flex-direction: column;
            gap: 10px;
        }
        .u-menu {
            padding: 5px;
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
            width: @w;
            text-align: center;
            background-color: #eee;
            font-size: 12px;
            color: #000;
            cursor: pointer;
            &:hover {
                background-color: #f5f7fa;
            }
            &.is-active {
                color: #0366d6;
            }
        }
    }
}
</style>
