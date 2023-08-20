import { $node, $helper } from "@jx3box/jx3box-common/js/https";
const $ = $node()

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

export function getNewestPost(client = 'std') {
    const params = {
        type: 'quest',
        client
    };
    return $helper().get(`/api/wiki/posts/newest`, { params });
}

export function getWaiting(params) {
    params = Object.assign(params, {
        type: 'quest',
    });
    return $helper().get(`/api/wiki/posts/waiting`, { params });
}

export function getWaitingRate(params) {
    params = Object.assign(params, {
        type: 'quest',
    });
    return $helper().get(`/api/wiki/posts/counter`, { params });
}