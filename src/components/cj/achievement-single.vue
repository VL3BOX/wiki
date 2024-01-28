<template>
    <div class="m-achievement-single" :class="{ fold: fold, hidden: isHidden }" v-if="hasContent">
        <el-checkbox
            v-if="initFold && isLogin && isVirtual"
            class="u-achievement-checkbox"
            v-model="achievement.checked"
        ></el-checkbox>
        <div class="u-header">
            <a class="u-title" :target="targetable" @click="url_filter(achievement.ID)">
                <i class="m-achievement-status u-attr u-fav u-complete-status el-tag--light el-tag" :class="completed ? 'el-tag--success' : 'el-tag--warning'" v-if="!isVirtual">
                    <i :class="completed ? 'el-icon-check' : 'el-icon-warning-outline'"></i>
                    {{ completed ? "已完成" : "待完成" }}
                </i>
                <i class="m-achievement-status u-attr u-fav u-complete-status el-tag--light el-tag" :class="completedVirtual ? 'el-tag--success' : 'el-tag--warning'" v-else>
                    <i :class="completedVirtual ? 'el-icon-check' : 'el-icon-warning-outline'"></i>
                    {{ completedVirtual ? "已完成" : "待完成" }}
                </i>
                <span class="u-title-text">{{ achievement.Name }}</span>
            </a>
            <div class="u-other">
                <span
                    class="u-attr"
                    v-text="achievement.post ? '修订时间：' + ts2str(achievement.post.updated) : ''"
                ></span>
                <span
                    class="u-attr"
                    v-text="achievement.post ? '综合难度：' + star(achievement.post.level) : ''"
                ></span>
                <template v-if="isVirtual">
                    <el-button
                        v-if="!completedVirtual"
                        class="u-attr u-fav"
                        plain
                        size="mini"
                        icon="el-icon-check"
                        @click.stop="finishVirtual"
                    >
                        设为完成
                    </el-button>
                    <el-button
                        v-else
                        class="u-attr u-fav"
                        type="info"
                        size="mini"
                        icon="el-icon-close"
                        @click.stop="cancelVirtual"
                    >
                        取消完成
                    </el-button>
                </template>
                <Fav
                    v-if="showFavorite"
                    class="u-attr u-fav"
                    post-type="achievement"
                    :post-title="favTitle"
                    :post-id="achievement.ID"
                />
            </div>
        </div>
        <div class="u-body">
            <div class="u-left" @click="url_filter(achievement.ID)">
                <div class="u-attr u-icon">
                    <img
                        :src="icon_url(achievement.IconID)"
                        @error.once="
                            () => {
                                $event.target.src = icon_url();
                            }
                        "
                    />
                </div>
                <div class="u-attr u-desc" v-html="achievement.Desc"></div>
            </div>
            <div class="u-right">
                <item-simple
                    class="u-attr u-item-simple"
                    :item="achievement.Item"
                    only-icon="true"
                    :icon-size="'36px'"
                />
                <div class="u-attr u-point" v-text="achievement.Point ? achievement.Point : 0"></div>
            </div>
        </div>
        <div class="u-footer">
            <div v-if="achievement.Prefix || achievement.Postfix" class="u-ch">
                <div v-if="achievement.PrefixName" v-text="'称号前缀：' + achievement.PrefixName"></div>
                <div v-if="achievement.PostfixName" v-text="'称号后缀：' + achievement.PostfixName"></div>
            </div>
            <el-row v-if="achievement.SubAchievementList" class="u-subs" :gutter="30">
                <el-col
                    v-for="(sub_achievement, key) in achievement.SubAchievementList"
                    :key="key"
                    :xs="12"
                    :sm="8"
                    :md="8"
                    class="u-sub"
                >
                    <router-link
                        :to="
                            sub_achievement.Visible == 1
                                ? {
                                      name: 'view',
                                      params: { source_id: sub_achievement.ID },
                                  }
                                : {}
                        "
                        target="_blank"
                    >
                        <img class="u-icon" :src="icon_url(sub_achievement.IconID)" />
                        <span v-text="sub_achievement.Name"></span>
                    </router-link>
                </el-col>
            </el-row>
            <div v-if="achievement.SeriesAchievementList" class="u-seriess">
                <div
                    v-for="(series_achievement, key) in achievement.SeriesAchievementList"
                    class="u-series"
                    :key="key"
                    :class="series_achievement.ID == achievement.ID ? 'active' : ''"
                >
                    <router-link
                        :to="{
                            name: 'view',
                            params: { source_id: series_achievement.ID },
                        }"
                    >
                        <img class="u-icon" :src="icon_url(series_achievement.IconID)" />
                        <div class="detail">
                            <h4 v-text="series_achievement.Name"></h4>
                            <p v-html="description_filter(series_achievement.ShortDesc)"></p>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
        <div class="u-expand" v-if="!empty" :class="{ disable: empty }" @click="fold = !fold">
            <hr />
            <i class="u-icon el-icon-caret-top"></i>
            <i class="u-icon el-icon-caret-bottom"></i>
        </div>
    </div>
</template>

<script>
import { ts2str, iconLink } from "@jx3box/jx3box-common/js/utils";
import Fav from "@jx3box/jx3box-common-ui/src/interact/Fav.vue";
import ItemSimple from "@jx3box/jx3box-editor/src/ItemSimple.vue";
import star from "@/utils/star";
import { setVirtualRoleAchievements, cancelVirtualRoleAchievements } from "@/service/achievement";
import User from "@jx3box/jx3box-common/js/user";

export default {
    name: "AchievementSingle",
    props: ["achievement", "initFold", "target", "jump", "showFavorite"],
    data() {
        return {
            fold: true,
        };
    },
    computed: {
        empty() {
            return !(
                this.achievement.Prefix ||
                this.achievement.Postfix ||
                this.achievement.SubAchievementList ||
                this.achievement.SeriesAchievementList
            );
        },
        targetable() {
            return this.target || typeof this.target !== "undefined" ? this.target : "";
        },
        client: function () {
            return this.$store.state.client;
        },
        hasContent: function () {
            return this.achievement && Object.keys(this.achievement).length;
        },
        currentRole() {
            return this.$store.state.role;
        },
        completeAchievements() {
            return this.$store.state.achievements;
        },
        completed() {
            return this.completeAchievements.includes(this.achievement.ID + "");
        },
        isLogin() {
            return User.isLogin();
        },
        favTitle: function () {
            return this.achievement?.Name;
        },
        isVirtual() {
            // 是否是虚拟角色 - 魔盒账号
            return !this.currentRole?.jx3id;
        },
        onlyUncompleted() {
            return this.$store.state.onlyUncompleted;
        },
        isHidden() {
            const completed = this.isVirtual ? this.completedVirtual : this.completed;
            return this.onlyUncompleted && completed;
        },
        achievementsVirtual() {
            return this.$store.state.achievementsVirtual;
        },
        completedVirtual() {
            return this.achievementsVirtual.includes(this.achievement.ID + "");
        },
    },
    watch: {
        initFold: {
            immediate: true,
            handler(bol) {
                this.fold = bol;
            },
        },
    },
    methods: {
        ts2str,
        star,
        icon_url: function (id) {
            return iconLink(id, this.client);
        },
        url_filter(source_id) {
            if (this.jump === true || typeof this.jump === "undefined") {
                this.$store.state.scroll_tops[this.$route.name] = document.documentElement.scrollTop;
                this.$router.push({
                    name: "view",
                    params: { source_id: source_id },
                });
            }
        },
        // 描述过滤
        description_filter(value) {
            let matchs = /text="(.*?)(\\\\\\n)?"/.exec(value);
            if (matchs && matchs.length > 1) value = matchs[1].trim();
            if (value) value = value.replace(/\\n/g, "<br>");
            return value;
        },
        // 虚拟角色完成
        finishVirtual() {
            if (!this.isLogin) {
                User.toLogin();
            }
            if (!this.currentRole || this.currentRole.jx3id) {
                this.$alert("请先在侧边栏选择虚拟角色", "警告", {
                    confirmButtonText: "确定",
                });
                return;
            }
            const id = this.achievement.ID + "";
            const data = {
                achievements: id,
            };
            setVirtualRoleAchievements(data).then((res) => {
                this.$notify({
                    title: "操作成功",
                    message: "已将该成就标记为已完成",
                    type: "success",
                });
                const list = this.achievementsVirtual;
                if (!list.includes(id)) {
                    list.push(id);
                }
                this.$store.commit("SET_STATE", { key: "achievementsVirtual", value: list });
            });
        },
        // 取消完成
        cancelVirtual() {
            if (!this.isLogin) {
                User.toLogin();
            }

            if (!this.currentRole || this.currentRole.jx3id) {
                this.$alert("请先在侧边栏选择虚拟角色", "警告", {
                    confirmButtonText: "确定",
                });
                return;
            }

            const id = this.achievement.ID + "";
            const data = {
                achievements: id,
            };
            cancelVirtualRoleAchievements(data).then((res) => {
                this.$notify({
                    title: "操作成功",
                    message: "已将该成就标记为待完成",
                    type: "success",
                });
                const list = this.achievementsVirtual;
                const index = list.findIndex((item) => item === id);
                if (index > -1) {
                    list.splice(index, 1);
                }
                this.$store.commit("SET_STATE", { key: "achievementsVirtual", value: list });
            });
        },
    },
    components: {
        "item-simple": ItemSimple,
        // Fav,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/cj/achievement.less";
</style>
