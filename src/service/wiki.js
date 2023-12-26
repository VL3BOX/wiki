import { $cms } from "@jx3box/jx3box-common/js/https";
// 贡献排行榜
export function getWikiRanking(params) {
    return $cms().get(`/api/cms/wiki/post/rank`, {
        params,
    });
}
