// 第三方UI组件
import Vue from "vue";
import ElementUI from "element-ui";
Vue.use(ElementUI);

import VueI18n from "vue-i18n";
Vue.use(VueI18n);
import i18n from "@jx3box/jx3box-common/i18n";

// 通用UI模块
import JX3BOX_UI from '@jx3box/jx3box-common-ui'
import "@jx3box/jx3box-common/css/element.css";
import "@jx3box/jx3box-common/css/normalize.css";
Vue.use(JX3BOX_UI);


import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard);

import router from "../router/cj";
import store from "../store/cj";
import App from "../views/cj/index.vue";

import reporter from "@jx3box/jx3box-common/js/reporter";
reporter.install(Vue);

new Vue({
    i18n,
    router,
    store,
    render: h => h(App),
}).$mount("#app");
