<template>
    <div class="m-extend" :class="{ isHome: isHome }">
        <RightSideMsg>
            <em>官方反馈交流Q群</em> :
            <strong>
                <a href="https://jq.qq.com/?_wv=1027&k=5S50j08">614370825</a>
            </strong>
        </RightSideMsg>

        <MyItems />
        <MyPlans />

    </div>
</template>

<script>
import { __Links, __ossRoot } from '@jx3box/jx3box-common/data/jx3box.json';
import User from "@jx3box/jx3box-common/js/user.js";
import MyPlans from '@/components/item/MyPlans.vue'
import MyItems from '@/components/item/MyItems.vue'
export default {
    name: "Extend",
    props: [],
    data: function() {
        return {
            isHome: true,
            hot_items: null,
            user: User.getInfo(),
        };
    },
    components: {
        MyPlans,
        MyItems
    },
    methods: {
        checkIsHome: function() {
            this.isHome = this.$route.name == "home" || !this.$route.name;
        },
    },
    watch: {
        "$route.name": function(newpath) {
            this.checkIsHome();
        },
    },
    mounted: function() {
        this.checkIsHome();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/item/extend.less";
</style>
