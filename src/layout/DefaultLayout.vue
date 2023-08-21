<template>
    <div>
        <Header></Header>

        <Breadcrumb :name="name" :slug="slug" :root="computedRoot" :publishEnable="publishEnable" :adminEnable="adminEnable" :topicEnable="topicEnable" :feedbackEnable="feedbackEnable" :overlayEnable="overlayEnable" :crumbEnable="crumbEnable" :withoutLeft="withoutLeft" :adminMarks="adminMarks"></Breadcrumb>
        <LeftSidebar>
            <slot name="left"></slot>
        </LeftSidebar>

        <Main :withoutRight="withoutRight">
            <div class="m-main">
                <slot></slot>
            </div>

            <RightSidebar>
                <slot name="right"></slot>
            </RightSidebar>
            <Footer></Footer>
        </Main>
    </div>
</template>

<script>
export default {
    name: "DefaultLayout",
    props: {
        name: {
            type: String,
            default: "成就百科"
        },
        slug: {
            type: String,
            default: "achievement"
        },
        root: {
            type: String,
            default: ""
        },
        withoutRight: {
            type: Boolean,
            default: false
        },
        publishEnable: {
            type: Boolean,
            default: false
        },
        adminEnable: {
            type: Boolean,
            default: false
        },
        topicEnable: {
            type: Boolean,
            default: false
        },
        feedbackEnable: {
            type: Boolean,
            default: false
        },
        overlayEnable: {
            type: Boolean,
            default: false
        },
        crumbEnable: {
            type: Boolean,
            default: true
        },
        withoutLeft: {
            type: Boolean,
            default: false
        },
        adminMarks: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        computedRoot: function () {
            return this.root ? this.root : this.slug;
        }
    }
};
</script>

<style lang="less">
.c-main {
    padding: 0 10px;
}
.m-main {
    padding-top: 10px;
}
</style>
