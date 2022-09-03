import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/en"; // lang i18n

import "@/styles/index.scss"; // global css

import App from "./App";
import store from "./store";
import router from "./router";

import "@/icons"; // icon
import "@/permission"; // permission control


//引入全局组件 三级联动
import CategorySelect from "@/components/CategorySelect";
Vue.component("CategorySelect", CategorySelect);
// set ElementUI lang to EN
Vue.use(ElementUI, { locale });
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false;
//引入相关API请求接口
import API from "@/api";
Vue.prototype.$API = API;

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
