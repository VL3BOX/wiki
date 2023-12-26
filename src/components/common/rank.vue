<template>
    <div class="m-wiki-rank">
        <h2 class="m-title">
            <img class="u-icon" svg-inline src="@/assets/img/cj/rank.svg" />
            <span class="u-text">贡献榜</span>
        </h2>
        <ul class="u-list">
            <li v-for="(rank, k) in ranks" :key="k">
                <a class="u-contributor" :href="rank.user_id ? authorLink(rank.user_id) : null">
                    <i class="u-avatar">
                        <img :src="showAvatar(rank.avatar)" :alt="rank.nickname" />
                    </i>
                    <span class="u-name" v-text="rank.nickname"></span>
                    <em class="u-count">+ {{ rank.count }}</em>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import { getWikiRanking } from "@/service/wiki";
import { authorLink, showAvatar } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "WikiRanks",
    props: {
        type: {
            type: String,
            default: "achievement",
        },
    },
    data() {
        return {
            ranks: [],
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
    },
    mounted() {
        this.loadData();
    },
    methods: {
        showAvatar,
        authorLink,
        loadData() {
            const params = {
                type: this.type,
                client: this.client,
            };
            getWikiRanking(params).then((res) => {
                this.ranks = res.data?.data || [];
            });
        },
    },
};
</script>

<style lang="less">
.m-wiki-rank {
    padding: 15px;
    .m-title {
        .fz(18px, 24px);
        margin: 0;
        padding: 0 0 5px 0;
        border-bottom: 1px solid #ebeef5;
    }

    .u-icon {
        .h(24px);
        .y(top);
        fill: @bg-black;
        .mr(5px);
    }

    .u-list {
        list-style: none;
        padding: 0;
        margin: 0;

        max-height: 360px;
        overflow: hidden auto;
        padding-right: 5px;
        .scrollbar();
    }

    .u-contributor {
        .db;
        padding: 5px 0;

        &:hover {
            background-color: @bg-light;
        }
    }

    @h: 24px;

    .u-avatar {
        .db;
        .fl;
        .size(@h);
        .mr(15px);

        img {
            .db;
            .full;
        }
    }

    .u-name {
        .fz(13px);
        .lh(@h);
        color: #555;
    }

    .u-count {
        .fz(12px, @h);
        color: @primary;
        .fr;
        .mr(2px);
    }
}
@media screen and (max-width: @ipad) {
    .m-wiki-rank {
        .none;
    }

    .isHome {
        .m-wiki-rank {
            .db;
        }
    }
}
</style>
