<template>
    <div>
        <div class="m-menus">
            <a
                class="u-menu"
                :class="pathname.indexOf(menu.value) > -1 && 'is-active'"
                v-for="menu in menus"
                :key="menu.value"
                :href="`/${menu.value}`"
            >
                {{ menu.label }}
            </a>
        </div>
    </div>
</template>

<script>
export default {
    name: "CommonMenu",
    data() {
        return {
            menus: [
                {
                    label: "成就",
                    value: "cj",
                },
                {
                    label: "物品",
                    value: "item",
                },
                {
                    label: "任务",
                    value: "quest",
                },
                {
                    label: "通识",
                    value: "knowledge",
                },
            ],
        };
    },
    computed: {
        pathname() {
            return location.pathname;
        },
    },
};
</script>
