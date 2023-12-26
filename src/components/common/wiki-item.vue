<template>
    <router-link
        class="u-item u-item-new"
        :to="{
            name: 'view',
            params: getViewParams(),
        }"
    >
        <div class="u-icon">
            <img :src="iconUrl(item.IconID)" />
        </div>
        <div class="m-carousel-content">
            <span class="u-title">
                <i class="el-icon-medal"></i>
                <span v-text="` ${item.Name}`"></span>
            </span>
            <span class="u-desc">
                <i class="el-icon-mic"></i>
                <span v-html="` ${parseDesc(item.Desc)}`"></span>
            </span>
        </div>
    </router-link>
</template>

<script>
import { iconLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "WikiItem",
    props: {
        item: {
            type: Object,
            required: true,
        },
        type: {
            type: String,
            default: "achievement",
        },
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
    },
    methods: {
        iconUrl: function (id) {
            return iconLink(id, this.client);
        },
        getViewParams() {
            let params = {
                source_id: this.item.ID,
            };
            if (this.type === "item") {
                params = {
                    item_id: this.item.id,
                };
            }
            return params;
        },
        parseDesc(desc) {
            return desc
                ? desc
                      .replaceAll('<Text>text="', "")
                      .replace(/\".*?<\/text>/g, "")
                      .replaceAll("\\\\\\n", "")
                : "-";
        },
    },
};
</script>
