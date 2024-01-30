<template>
    <div class="m-left-side">
        <div class="m-related-roles">
            <!-- <div v-if="!isLogin" class="u-tip el-alert el-alert--info is-light">
                <i class="el-icon-warning-outline"></i> <a href="/team/role/bind" target="_blank">绑定角色</a>
            </div> -->
            <el-select
                v-if="isLogin"
                v-model="currentRole"
                value-key="ID"
                placeholder="请选择当前角色"
                :disabled="!isLogin"
                popper-class="m-related-roles-options"
            >
                <span slot="prefix" class="u-prefix">
                    角色
                    <el-tooltip
                        v-if="!isVirtual && !isSync"
                        class="item"
                        effect="dark"
                        content="请先在游戏中同步成就"
                        placement="top"
                    >
                        <a href="/tool/74559" target="_blank"><i class="el-icon-warning-outline"></i></a>
                    </el-tooltip>
                    <el-tooltip
                        v-else
                        class="item"
                        effect="dark"
                        content="虚拟角色即为魔盒账号本身，可自定义进度"
                        placement="top"
                    >
                        <a href="/tool/74559" target="_blank"><i class="el-icon-warning-outline"></i></a>
                    </el-tooltip>
                </span>
                <el-option v-if="isLogin" :value="virtualRole" :label="virtualRole.name + '<虚拟角色>'">
                    <span class="u-role">
                        <span class="u-role-name"
                            ><img class="u-role-icon" :src="virtualRole.avatar" />{{ virtualRole.name }}</span
                        >
                        <span class="u-role-server"> &lt;虚拟角色&gt;</span>
                    </span>
                </el-option>
                <el-option v-for="role in roleList" :key="role.ID" :value="role" :label="role.name">
                    <span class="u-role">
                        <span class="u-role-name"
                            ><img class="u-role-icon" :src="showSchoolIcon(role.mount)" />{{ role.name }}</span
                        >
                        <span class="u-role-server">{{ role.server }}</span>
                    </span>
                </el-option>
            </el-select>
        </div>
        <el-select v-model="sidebar.general">
            <el-option v-for="type in menu_types" :key="type.value" :label="type.label" :value="type.value"></el-option>
        </el-select>
        <div v-if="currentRole" class="m-filters">
            <el-checkbox v-model="uncompleted" label="只看未完成" border size="small"></el-checkbox>
            <div class="u-total" v-if="[1, 2].includes(sidebar.general)">
                <!-- numTotal -->
                <b class="u-completed-num">{{ completedNum }}</b>
                <span class="u-total-num"> / {{ achievementTotal }}</span>
            </div>
        </div>
        <div class="m-menus">
            <el-tree
                class="filter-tree"
                :class="{ other: [3].includes(sidebar.general) }"
                :data="menus"
                node-key="id"
                :expand-on-click-node="false"
                @node-click="clickNode"
                :filter-node-method="filterNode"
                ref="tree"
            >
                <router-link class="el-tree-node__label" slot-scope="{ data }" :to="menu_url(data)">
                    <span class="u-name" v-text="data.name"></span>
                    <em v-if="data.achievements_count" class="u-count">
                        (<span v-if="currentRole">{{ `${getMenuCompleted(data)}/` }}</span>
                        <span>{{ `${data.achievements_count + ~~data.own_achievements_count}` }}</span
                        >)
                    </em>
                </router-link>
            </el-tree>
        </div>
    </div>
</template>

<script>
import { getMenus, getRoleGameAchievements, getVirtualRoleAchievements } from "@/service/achievement";

import Bus from "@jx3box/jx3box-common-ui/service/bus";
import { getUserRoles } from "@/service/team";
import User from "@jx3box/jx3box-common/js/user";
import { showSchoolIcon } from "@jx3box/jx3box-common/js/utils";
import { flattenDeep, cloneDeep } from "lodash";
export default {
    name: "Sidebar",
    props: ["sidebar"],
    data() {
        return {
            menus_cache: [],
            menus: [],
            old_node: null,
            menu_types: [
                { value: 1, label: "常规成就" },
                { value: 2, label: "五甲成就" },
                // { value: 4, label: "宠物成就" },
                // { value: 5, label: "奇遇成就" },
                { value: 3, label: "其他板块" },
            ],

            roleList: [],
            currentRole: "",
            isLogin: User.isLogin(),
            uncompleted: false,
            virtualRole: {
                ...User.getInfo(),
                jx3id: 0,
                ID: ~~User.getInfo().uid,
            },
            isSync: false,
        };
    },
    computed: {
        achievementTotal() {
            return this.$store.state.achievementTotal;
        },
        achievements() {
            return this.$store.state.achievements;
        },
        achievementsVirtual() {
            return this.$store.state.achievementsVirtual;
        },
        isVirtual() {
            // 是否是虚拟角色 - 魔盒账号
            return !this.currentRole?.jx3id;
        },
        completedNum({ menus, achievementsVirtual, achievements }) {
            const completedNumList = menus.map((data) => {
                return this.getMenuCompleted(data, achievementsVirtual, achievements);
            });
            return completedNumList.reduce((acc, cur) => {
                return acc + cur;
            }, 0);
        },
        completedVirtualNum() {
            const menus = cloneDeep(this.menus).map((newData) => {
                newData.all_achievements = newData.children
                    ? Array.from(
                          new Set(
                              newData.achievements.concat(
                                  flattenDeep(newData.children.map((item) => item.achievements))
                              )
                          )
                      )
                    : newData.achievements;
                return newData;
            });
            const menuAchievements = flattenDeep(menus.map((item) => item.all_achievements));
            return this.achievementsVirtual.filter((id) => menuAchievements.includes(~~id))?.length;
        },
        numTotal() {
            // 将游戏角色的总量统计和虚拟角色总量统计做了区分，游戏角色按照游戏内的计算来，不计算阶段成就的子类；
            // 虚拟角色因为要自己设置完成，计算阶段成就方便用户点击完成后有及时反馈。
            return this.isVirtual ? this.completedVirtualNum : this.completedNum;
        },
    },
    watch: {
        sidebar: {
            immediate: true,
            deep: true,
            handler(new_val, old_val) {
                let that = this;

                // 展开菜单
                that.expand_menu();

                // 异步加载侧边栏数据
                if (that.sidebar.general) that.get_menus(this.sidebar.general);
            },
        },
        // roleList() {
        //     if (this.roleList.length && !this.currentRole) {
        //         this.currentRole = this.roleList[0];
        //     }
        // },
        virtualRole: {
            immediate: true,
            deep: true,
            handler(virtualRole) {
                this.currentRole = virtualRole;
            },
        },
        currentRole: {
            immediate: true,
            deep: true,
            handler(val) {
                if (!val) return;
                sessionStorage.setItem("cj-current-role", JSON.stringify(val));
                this.$store.commit("SET_STATE", { key: "role", value: val });
                const { jx3id } = val;
                if (jx3id) {
                    this.$store.commit("SET_STATE", { key: "achievementsVirtual", value: [] });
                    this.loadRoleAchievements(jx3id);
                } else {
                    if (jx3id === 0) {
                        // 虚拟角色
                        this.loadVirtualAchievements();
                    }
                    this.$store.commit("SET_STATE", { key: "achievements", value: [], isSession: true });
                }
            },
        },
        uncompleted(bol) {
            this.$store.commit("SET_STATE", { key: "onlyUncompleted", value: bol });
        },
        isLogin: {
            immediate: true,
            handler(bol) {
                if (!bol) {
                    this.currentRole = "";
                    this.$store.commit("SET_STATE", { key: "role", value: "" });
                    this.$store.commit("SET_STATE", { key: "cj-current-role", value: "", isSession: true });
                    // this.$store.commit("SET_STATE", { key: "cj-roles", value: [], isSession: true });
                    this.$store.commit("SET_STATE", { key: "achievements", value: [], isSession: true });
                }
            },
        },
    },
    methods: {
        getLastAchievement(achievements = []) {
            // 比如传功，只取最后一个传功100次的ID作为是否完成的依据
            return achievements.map((achievement) => {
                if (Array.isArray(achievement)) {
                    // 比如传功，只取最后一个传功100次的ID作为是否完成的依据
                    const lastOne = achievement?.[achievement.length - 1];
                    return lastOne;
                } else {
                    return achievement;
                }
            });
        },
        getMenuCompleted(data, achievementsVirtual, achievements) {
            const newData = cloneDeep(data);
            newData.all_achievements = newData.children
                ? Array.from(
                      new Set(
                          newData.achievements.concat(
                              flattenDeep(
                                  newData.children.map((item) => {
                                      return this.getLastAchievement(item.achievements);
                                  })
                              )
                          )
                      )
                  )
                : this.getLastAchievement(newData.achievements);
            const list = this.isVirtual
                ? achievementsVirtual || this.achievementsVirtual
                : achievements || this.achievements;
            return newData.all_achievements.filter((item) => list.includes(item + ""))?.length;
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        clickNode(data, node) {
            let that = this;
            // Sub菜单下无成就时，默认打开第一个Detail菜单
            let first_node = null;
            if (data.own_achievements_count === 0) {
                first_node = node.childNodes[0];
                if (first_node) {
                    setTimeout(function () {
                        that.$router.push({
                            name: that.sidebar.general == 2 ? "top_five" : "normal",
                            params: {
                                sub: first_node.data.sub,
                                detail: first_node.data.detail,
                            },
                        });
                    }, 100);
                    this.$refs.tree.store.setCurrentNode(first_node);
                }
            }

            // 展开/收起
            let _node = first_node ? first_node : node;
            if (node.expanded !== true) {
                node.expanded = true;
            } else if (this.old_node == _node) {
                node.expanded = false;
            }

            // 记录上一个节点
            this.old_node = _node;

            // 移动端收起边栏
            if (window.innerWidth < 1024) {
                if (node.isLeaf) {
                    Bus.$emit("toggleLeftSide", false);
                }
            }
        },
        get_menus(general) {
            let that = this;

            if (that.menus_cache[general]) {
                that.menus = that.menus_cache[general];
                return;
            }

            if (general == 3) {
                that.menus = [
                    { name: "最新成就", id: "newest", router: "newest" },
                    { name: "待攻略成就", id: "waiting", router: "waiting" },
                    // { name: "绝版成就", id: "out_print", router: "out_print" },
                    { name: "奇遇成就", id: "adventure", router: "adventure" },
                    { name: "珍奇成就", id: "rare", router: "rare" },
                ];
                return;
            }

            // if (general === 4) {
            //     that.menus = [{ name: "宠物成就", id: "rare", router: "rare" }];
            //     that.$router.push({ name: 'rare' })
            //     that.$refs.tree.setCurrentKey('rare')
            //     return;
            // }
            // if (general === 5) {
            //     that.menus = [{ name: "奇遇成就", id: "adventure", router: "adventure" }];
            //     that.$router.push({ name: 'adventure' })
            //     // that.$refs.tree.setCurrentKey('adventure')
            //     return;
            // }

            getMenus(general).then(
                (data) => {
                    data = data.data;
                    if (data.code === 200) {
                        let menus = [];
                        for (let i in data.data.menus) menus.push(data.data.menus[i]);
                        that.menus = menus;

                        // 缓存菜单数据
                        that.menus_cache[general] = menus;

                        // 展开菜单
                        that.expand_menu();
                    }
                },
                () => {
                    that.menus = false;
                }
            );
        },
        expand_menu() {
            let that = this;
            that.$nextTick(function () {
                // 默认展开当前菜单
                let key = "";
                if (that.sidebar.general != 3) {
                    let sub = that.sidebar.sub;
                    let detail = that.sidebar.detail;
                    key = sub + (detail ? `-${detail}` : "");
                } else {
                    key = that.sidebar.other;
                }

                if (key) {
                    let node = that.$refs.tree.store.getNode(key);
                    if (node) {
                        node.expanded = true;
                        if (node.parent) node.parent.expanded = true;
                        that.$refs.tree.store.setCurrentNode(node);
                        return;
                    }
                }
                // let all = that.$refs.tree.store._getAllNodes();
                // for (let i = 0; i < all.length; i++) all[i].expanded = false;
            });
        },
        menu_url(data) {
            switch (this.sidebar.general) {
                case 1:
                    return {
                        name: "normal",
                        params: { sub: data.sub, detail: data.detail },
                    };
                case 2:
                    return {
                        name: "top_five",
                        params: { sub: data.sub, detail: data.detail },
                    };
                case 3:
                    // case 4:
                    // case 5:
                    return { name: data.router };
            }
            return null;
        },

        // 获取用户角色列表
        loadUserRoles() {
            this.isLogin &&
                getUserRoles().then((res) => {
                    this.roleList =
                        res.data?.data?.list.filter((item) => {
                            return !!item.player_id;
                        }) || [];
                    // sessionStorage.setItem("cj-roles", JSON.stringify(this.roleList));
                });
        },
        // 获取角色成就状态
        loadRoleAchievements(jx3id) {
            getRoleGameAchievements(jx3id).then((res) => {
                const achievements = res.data?.data?.achievements || "";
                const jx3id = res.data?.data?.jx3id;
                this.isSync = !!jx3id; // 是否在游戏中同步
                const list = achievements.split(",");
                this.$store.commit("SET_STATE", { key: "achievements", value: list, isSession: true });
            });
        },
        showSchoolIcon,
        // 获取虚拟角色成就列表
        loadVirtualAchievements() {
            if (!this.currentRole || this.currentRole.jx3id) return;
            getVirtualRoleAchievements().then((res) => {
                const achievements = res.data?.data?.achievements || "";
                const list = achievements.split(",");
                this.$store.commit("SET_STATE", { key: "achievementsVirtual", value: list });
            });
        },
    },
    mounted() {
        if (sessionStorage.getItem("cj-current-role")) {
            this.currentRole = JSON.parse(sessionStorage.getItem("cj-current-role"));
            this.loadUserRoles();
        } else {
            // if (sessionStorage.getItem("cj-roles")) {
            //     this.roleList = JSON.parse(sessionStorage.getItem("cj-roles"));
            // } else {
            this.loadUserRoles();
            // }
        }
    },
};
</script>

<style lang="less">
@import "~@/assets/css/cj/left-side.less";
</style>
