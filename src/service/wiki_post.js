import { $cms } from "@jx3box/jx3box-common/js/https";

const getWikiPostLatest = (params) => {
    return $cms().get("/api/cms/helper/wiki/post/latest", { params: params });
};

export { getWikiPostLatest };
