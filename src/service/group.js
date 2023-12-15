import { $helper, $cms } from "@jx3box/jx3box-common/js/https";

function get_groups(type, params) {
    return $helper().get(`api/groups/${type}`, {
        params: params,
    });
}
function getMenuGroup(name) {
    return $cms({ mute: true }).get(`/api/cms/menu-group/${name}`, {});
}

export { get_groups, getMenuGroup };
