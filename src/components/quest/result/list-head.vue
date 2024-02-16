<template functional>
    <div class="m-list-head">
        <div>{{ parent.$t('起始地图') }}</div>
        <div>{{ parent.$t('任务名称') }}</div>
        <div>{{ parent.$t('可接等级') }}</div>
        <div>{{ parent.$t('任务目标') }}</div>
        <div>{{ parent.$t('任务奖励') }}</div>
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
