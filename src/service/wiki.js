import { $helper } from "@jx3box/jx3box-common/js/https.js";

// 获取通识子类
function getKnowledgeMenus() {
	return $helper().get(`/api/knowledge/menus`);
}

export { getKnowledgeMenus };
