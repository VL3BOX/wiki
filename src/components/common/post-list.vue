<template>
    <WikiPanel :border-none="true">
        <template slot="head-title">
            <i class="el-icon-collection"></i>
            <span>{{ $t('最近攻略') }}</span>
        </template>
        <template slot="body">
            <el-row class="m-posts">
                <PostItem v-for="(post, key) in newestPosts" :post="post" :key="key"></PostItem>
            </el-row>
        </template>
    </WikiPanel>
</template>

<script>
import WikiPanel from "@/components/wiki-panel.vue";
import PostItem from "@/components/common/post-item.vue";
import { wiki } from "@jx3box/jx3box-common/js/wiki_v2";
export default {
    name: "WikiPostList",
    props: {
        type: {
            type: String,
            default: "achievement",
        },
    },
    data() {
        return {
            newestPosts: [],
        };
    },
    components: {
        WikiPanel,
        PostItem,
    },
    mounted() {
        // 获取最新成就攻略列表
        wiki.latest({ type: this.type }).then((res) => {
            this.newestPosts = res.data.data?.list ?? [];
        });
    },
};
</script>

<style lang="scss" scoped></style>
