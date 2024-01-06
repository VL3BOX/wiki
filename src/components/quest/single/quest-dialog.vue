<template>
    <div class="m-quest-dialog">
        <template v-if="desc.AcceptRpgID && desc.AcceptRpgID.dialogues">
            <div class="u-dialog">
                <p class="u-subtitle2"><span>接任务对话</span></p>
                <p
                    class="u-dialog-content"
                    v-for="(dialog, index) in desc.AcceptRpgID.dialogues"
                    :key="index"
                    v-html="questDescFormat(dialog[0])"
                ></p>
            </div>
        </template>
        <template v-if="desc.FinishRpgID && desc.FinishRpgID.dialogues">
            <div class="u-dialog">
                <p class="u-subtitle2"><span>任务完成对话</span></p>
                <p
                    class="u-dialog-content"
                    v-for="(dialog, index) in desc.FinishRpgID.dialogues"
                    :key="index"
                    v-html="questDescFormat(dialog[0])"
                ></p>
            </div>
        </template>
        <template v-if="desc.DunningDialogue">
            <div class="u-dialog">
                <p class="u-subtitle2"><span>任务进行中</span></p>
                <p class="u-dialog-content" v-html="questDescFormat(desc.DunningDialogue)"></p>
            </div>
        </template>
        <template v-if="desc.FinishedDialogue">
            <div class="u-dialog">
                <p class="u-subtitle2"><span>任务完成</span></p>
                <p class="u-dialog-content" v-html="questDescFormat(desc.FinishedDialogue)"></p>
            </div>
        </template>
    </div>
</template>

<script>
import { questDescFormat, questTargetDescFormat } from "@/utils/quest";

export default {
    name: "WorldQuestDialog",
    props: {
        desc: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {};
    },
    methods: {
        questTargetDescFormat,
        questDescFormat,
    },
};
</script>

<style lang="less">
.m-quest-dialog {
    .u-dialog {
        margin-bottom: 10px;
    }
    .u-dialog-content {
        padding: 5px 0;
        padding-left: 16px;
        font-size: 15px;
    }
    .u-dialog-name {
        color: #8a6d3b;
    }
    .u-dialog-desc {
        padding: 5px 0;
    }
}
</style>
