<template>
    <el-dialog class="m-wiki-diff-dialog" :visible.sync="show" :title="title" :before-close="close" width="80%">
        <div class="m-contents">
            <el-alert class="u-tip" title="请选择两个版本进行对比" type="info" show-icon> </el-alert>
            <el-checkbox-group v-model="checkboxGroup" :max="2" size="small" @change="checkChange">
                <el-checkbox border v-for="item in list" :label="item.id" :key="item.id">{{
                    item.version
                }}</el-checkbox>
            </el-checkbox-group>
            <code-diff
                v-if="checkboxGroup.length"
                class="m-content-view"
                :old-string="checkboxGroup.length === 2 ? checkboxContents[0] : ''"
                :new-string="checkboxGroup.length === 2 ? checkboxContents[1] : checkboxContents[0]"
                :context="1024"
                output-format="side-by-side"
                maxHeight="600px"
                :filename="checkboxGroup.length === 2 ? filename : ''"
                :newFilename="checkboxGroup.length === 2 ? newFilename : filename"
            ></code-diff>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button size="small" @click="close">关闭</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
import { getWiki } from "@/service/wiki";
import { cloneDeep } from "lodash";

import { CodeDiff } from "v-code-diff";
import { ts2str } from "@jx3box/jx3box-common/js/utils";

export default {
    name: "WikiDiff",
    components: {
        CodeDiff,
    },
    props: ["visible", "data"],
    data() {
        return {
            loading: false,
            checkboxGroup: [],
            list: [],
        };
    },
    computed: {
        title() {
            return "版本对比";
        },
        checkboxContents() {
            return this.list.filter((item) => this.checkboxGroup.includes(item.id)).map((item) => item.content);
        },
        filename() {
            const data = this.list.find((item) => item.id === this.checkboxGroup?.[0]);
            return `${data?.version || ""} ${data?.user_nickname || ""} ${data?.remark || ""} ${
                data?.updated ? ts2str(data?.updated) : ""
            }`;
        },
        newFilename() {
            const data = this.list.find((item) => item.id === this.checkboxGroup?.[1]);
            return `${data?.version || ""} ${data?.user_nickname || ""} ${data?.remark || ""} ${
                data?.updated ? ts2str(data?.updated) : ""
            }`;
        },
    },
    watch: {
        visible: {
            handler: function (val) {
                this.show = val;
            },
            immediate: true,
        },
        data: {
            immediate: true,
            deep: true,
            handler(data) {
                this.list = cloneDeep(data)
                    .reverse()
                    .map((item, index) => {
                        return {
                            ...item,
                            version: `v${index + 1}`,
                            content: "",
                        };
                    });
            },
        },
    },
    methods: {
        checkChange(list) {
            list.forEach((id) => {
                this.load(id);
            });
        },
        load(id) {
            this.loading = true;
            getWiki(id)
                .then((res) => {
                    const index = this.list.findIndex((item) => item.id === id);
                    const content = res.data?.data?.post?.content || "";
                    this.list[index].content = content;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        close() {
            this.show = false;
            this.$emit("close");
        },
    },
};
</script>

<style lang="less">
.m-wiki-diff-dialog {
    .el-dialog__body {
        padding-top: 10px;
    }
    .u-tip {
        margin-bottom: 10px;
    }
}
</style>
