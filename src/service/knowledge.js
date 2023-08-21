import { $helper, $cms } from "@jx3box/jx3box-common/js/https";

function getKnowledgeList(params) {
    return $helper()
        .get(`api/knowledge/menu_list`, { params })
        .then((res) => {
            return res.data.data;
        });
}

// 搜索
function getKnowledgeSearch(params) {
    return $helper()
        .get(`api/knowledges`, { params })
        .then((res) => {
            return res.data.data;
        });
}

// 获取内容详情
function getKnowledgeDetail(id) {
    return $helper()
        .get(`api/wiki/post`, {
            params: {
                source_id: id,
                type: "knowledge",
            },
        })
        .then((res) => {
            return res.data.data;
        });
}

// 获取版本
function getKnowledgePost(id) {
    return $helper()
        .get(`api/wiki/post/${id}`)
        .then((res) => {
            return res.data.data;
        });
}

// 获取最新更新帖子
function getKnowledgeNewest(params) {
    return $helper()
        .get(`/api/wiki/posts/newest`, { params })
        .then((res) => {
            return res.data.data;
        });
}

// 获取玩法指南
function getMenuGroups(params) {
    return $cms()
        .get(`/api/cms/menu-group`, { params })
        .then((res) => {
            return res.data.data;
        });
}

// 删除词条
function removeKnowledge(id) {
    return $helper().delete(`/api/knowledge/${id}`)
}

export { getKnowledgeList, getKnowledgeSearch, getKnowledgeDetail, getKnowledgePost, getKnowledgeNewest, getMenuGroups, removeKnowledge };
