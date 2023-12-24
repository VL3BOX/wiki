<template>
    <router-link
        class="u-item u-item-new"
        :to="{
            name: 'view',
            params: { source_id: item.ID },
        }"
    >
        <div class="u-icon">
            <img :src="icon_url(item.IconID)" />
        </div>
        <div class="m-carousel-content">
            <span class="u-title">
                <i class="el-icon-medal"></i>
                <span v-text="` ${item.Name}`"></span>
            </span>
            <span class="u-desc">
                <i class="el-icon-mic"></i>
                <span v-html="` ${item.Desc}`"></span>
            </span>
        </div>
    </router-link>
</template>

<script>
import { iconLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "AchievementItem",
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    methods: {
        icon_url: function (id) {
            return iconLink(id, this.client);
        },
    },
};
</script>
