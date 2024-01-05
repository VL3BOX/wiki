import { $node, $cms } from "@jx3box/jx3box-common/js/https";
const $ = $node();

/* import axios from 'axios'
const $ = axios.create({
    baseURL: 'http://localhost:7002/',
}) */

export function getCategory(params) {
    return $.get(`/quest/category`, { params });
}

export function getQuest(params) {
    return $.get(`/quest/`, { params });
}

export function getQuests(params) {
    return $.get(`/quests`, { params });
}

export function getNewestQuests(params) {
    return $.get(`/quests/newest`, { params });
}

export function getWaiting(params) {
    params = Object.assign(params, {
        type: "quest",
    });
    return $cms().get(`/api/cms/wiki/post/waiting`, { params });
}

export function getQuestMaps() {
    return $.get(`/quest/maps`);
}
