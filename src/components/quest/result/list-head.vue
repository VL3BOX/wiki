<template functional>
    <div class="m-list-head">
        <div>{{ $t('起始地图') }}</div>
        <div>{{ $t('任务名称') }}</div>
        <div>{{ $t('可接等级') }}</div>
        <div>{{ $t('任务目标') }}</div>
        <div>{{ $t('任务奖励') }}</div>
    </div>
</template>

<script>
export default {
    name: "ListHead",
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/quest/result/list-head.less";
</style>
