/**
 * 用户主页链接
 * @param {*} user_id 用户ID
 */

import { authorLink } from "@jx3box/jx3box-common/js/utils";

export default (user_id) => {
    return authorLink(user_id);
};