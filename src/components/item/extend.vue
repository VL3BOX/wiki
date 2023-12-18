<template>
    <div class="m-extend" :class="{ isHome: isHome }">
        <SideMsg></SideMsg>

        <MyItems />
        <MyPlans />
    </div>
</template>

<script>
import { __Links, __ossRoot } from "@jx3box/jx3box-common/data/jx3box.json";
import User from "@jx3box/jx3box-common/js/user.js";
import MyPlans from "@/components/item/my-plans.vue";
import MyItems from "@/components/item/my-items.vue";
import SideMsg from "@/components/common/side-msg.vue";
export default {
    name: "Extend",
    props: [],
    data: function () {
        return {
            isHome: true,
            hot_items: null,
            user: User.getInfo(),
        };
    },
    components: {
        MyPlans,
        MyItems,
        SideMsg,
    },
    methods: {
        checkIsHome: function () {
            this.isHome = this.$route.name == "home" || !this.$route.name;
        },
    },
    watch: {
        "$route.name": function (newpath) {
            this.checkIsHome();
        },
    },
    mounted: function () {
        this.checkIsHome();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/item/extend.less";
</style>
