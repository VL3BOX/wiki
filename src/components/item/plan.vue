<template>
    <el-popover popper-class="w-plans" placement="bottom" trigger="click" v-model="visible" width="300">
        <el-input class="m-input" v-model.lazy="search" :placeholder="$t('请输入清单关键字')" size="large" prefix-icon="el-icon-search"></el-input>
        <div class="m-list" v-if="list && list.length">
            <div class="u-list" v-for="(item, index) in list" :key="index">
                <div class="u-title" @click="showRelation(item, index)">
                    <i :class="relation_index == index ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"></i>
                    <span class="u-value" :class="hasInPlan(item) ? 'u-has' : ''">{{ item.title }} </span>
                </div>
                <template v-if="relation_index == index && item.relation">
                    <div class="u-child" v-for="(plan, k) in item.relation" :key="k" @click="addToPlan(item, k)">
                        <i class="el-icon-arrow-right"></i>
                        <span>{{ plan.title || $t('子清单') + (k + 1) }}</span>
                    </div>
                </template>
            </div>
        </div>
        <div v-else class="m-list">
            <el-alert :title="$t('暂无清单')" type="info" center show-icon :closable="false"> </el-alert>
        </div>
        <el-pagination
            class="m-pagination"
            background
            layout="prev, pager, next"
            :pager-count="5"
            small
            :hide-on-single-page="true"
            :page-size="per"
            :total="total"
            :current-page.sync="page"
        ></el-pagination>

        <el-popover popper-class="w-add-plans" placement="top" width="160" trigger="click" v-model="add">
            <el-input class="u-input" v-model="new_plan" :placeholder="$t('请输入新清单名称')"></el-input>
            <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="add = false">{{ $t('取消') }}</el-button>
                <el-button type="primary" size="mini" @click="createPlan">{{ $t('确定') }}</el-button>
            </div>
            <div class="m-create" slot="reference">
                <!-- <a href="/publish/#/item_plan" target="_blank" class="el-button"><i class="el-icon-document-add"></i> 创建新清单</a> -->
                <span class="el-button"><i class="el-icon-document-add"></i> {{ $t('创建新清单') }}</span>
            </div>
        </el-popover>

        <el-button size="mini" type="success" slot="reference" @click="openPlans"
            ><i class="u-el-icon el-icon-shopping-cart-full"></i> {{ $t('加入清单') }}</el-button
        >
    </el-popover>
</template>
<script>
import User from "@jx3box/jx3box-common/js/user";
import { getMyPlans, updatePlan, addMyPlan } from "@/service/item-plan.js";
import { pick } from "lodash";
export default {
    name: "plan",
    props: [],
    data: function () {
        return {
            visible: false,
            add: false,

            search: "",
            list: [],

            relation_index: -1,
            new_plan: "",

            page: 1,
            total: 0,
            per: 5,
        };
    },
    computed: {
        item_id: function () {
            return this.$route.params.item_id;
        },
        params: function () {
            return {
                page: this.page,
                per: this.per,
            };
        },
    },
    watch: {
        search(val) {
            this.loadPlans({ search: val });
        },
        page() {
            this.loadPlans(this.params);
        },
    },
    methods: {
        // 数据
        // ========================
        // 打开我的清单列表，未登录则跳转登录页
        openPlans() {
            if (!User.isLogin()) User.toLogin();
            this.loadPlans(this.params);
        },
        // 加载清单列表
        loadPlans(params) {
            let _params = Object.assign({ type: 1 }, params);
            getMyPlans(_params).then((res) => {
                this.list = res.list;
                this.total = res.total;
                console.log(this.list);
            });
        },

        // 交互
        // =========================
        // 是否在清单内
        hasInPlan(item) {
            let plan_items = [];
            item.relation.forEach((subplan) => {
                subplan?.data.forEach((e) => {
                    if (e) plan_items.push(e?.id);
                });
            });
            return plan_items.includes(this.item_id);
        },
        // 显示子清单
        showRelation(item, index) {
            if (this.relation_index == index) return (this.relation_index = -1);
            this.relation_index = index;
            if (!item.relation?.length) {
                item.relation = [];
                item.relation.push({
                    title: "子清单",
                    data: [],
                });
            }
        },
        // 加入物品清单
        addToPlan(item, k) {
            // 加到对应的子清单
            item.relation[k].data.push({
                id: this.item_id,
                count: 1,
            });
            this.postPlan(item.id, item);
        },
        // 提交清单
        postPlan(id, data) {
            const _data = pick(data, ['title', 'type', 'public', 'relation', 'description'])
            updatePlan(id, _data)
                .then(() => {
                    this.$message({
                        message: "添加成功",
                        type: "success",
                    });
                    this.visible = false;
                })
                .finally(() => {
                    this.relation_index = -1;
                });
        },
        // 创建新清单
        createPlan() {
            let data = {
                title: this.new_plan,
                relation: [
                    {
                        title: "子清单",
                        data: [{ id: this.item_id, count: 1 }],
                    },
                ],
                public: 1,
                type: 1,
                description: "",
            };
            this.list.push(data);
            addMyPlan(data)
                .then(() => {
                    this.$notify({
                        title: "新增清单成功",
                        message: "新增清单成功，物品已添加",
                        type: "success",
                    });
                })
                .finally(() => {
                    this.add = false;
                    this.visible = false;
                    this.new_plan = "";
                });
        },
    },
};
</script>
<style lang="less" scoped>
.w-plans {
    max-height: 800px;
    overflow-y: auto;
    .m-create {
        .x;
        .mt(10px);
        padding-top: 10px;
        border-top: 1px solid #eee;
        .el-button {
            padding: 8px 20px;
        }
    }
    .m-list {
        .pt(10px);
    }

    .u-list {
        .fz(14px, 2);
        .pointer;
        .u-title,
        .u-child {
            &:hover {
                color: @color-link;
                background-color: @bg-gray;
            }
        }
        .u-title {
            .flex;
            align-items: center;
            .u-value {
                width: 100%;
                .db;
            }
            .u-has::after {
                content: "(已加入)";
                .fr;
                .fz(12px);
            }
        }

        .u-child:hover:after {
            content: "✚";
            .fr;
        }
        .has-child {
            &::after {
                content: "  ";
                .fr;
            }
        }
        .u-status {
            color: #999;
            font-style: normal;
            .mr(5px);
        }

        .u-child {
            .pl(1em);
        }
        i {
            .mr(5px);
        }
    }
}
.w-add-plans {
    .u-input {
        .mb(10px);
    }
}
</style>
<style lang="less">
.w-plans,
.w-add-plans {
    z-index: 99 !important;
    width: 180px;
}
.m-item-icon-popup {
    padding: 0;
}
.m-pagination {
    .mt(10px);
    .w(100%);
}
</style>
