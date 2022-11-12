import Cookies from "js-cookie";

const TokenKey = "vue_admin_template_token";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function setName(name) {
  return Cookies.set("name", name);
}
export function setAvatar(avatar) {
  return Cookies.set("avatar", avatar);
}

export function setRoutes(routes) {
  return Cookies.set("routes", routes);
}

export function setButtons(buttons) {
  return Cookies.set("buttons", buttons);
}

//获取用户姓名
export function getName() {
  return Cookies.get("name");
}
//获取头像
export function getAvatar() {
  return Cookies.get("avatar");
}
//获取用户权限路由
export function getRoutes() {
  return Cookies.get("routes");
}
//获取用户按钮权限
export function getButtons() {
  return Cookies.get("buttons");
}
//存储计算出来要展示的异步路由
export function setResultAsyncRoutes(routes) {
  return sessionStorage.setItem("resultAsyncRoutes", JSON.stringify(routes));
}
//获取计算出来要展示的异步路由
export function getResultAsyncRoutes() {
  return JSON.parse(sessionStorage.getItem("resultAsyncRoutes"));
}
//存储最终要展示的路由
export function setResultAllRoutes(routes) {
  return sessionStorage.setItem("resultsAllRoutes", JSON.stringify(routes));
}
export function getResultAllRoutes() {
  return JSON.parse(sessionStorage.getItem("resultsAllRoutes"));
}
//删除所有cookie
export function removeAll() {
  clearAllCookie();//清除所有cookie
  sessionStorage.clear();//清除所有sessionStorage
  return 'success'
}
//定义一个清除所有cookie的方法
function clearAllCookie() {
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
  if (keys) {
    for (var i = keys.length; i--; )
      document.cookie = keys[i] + "=0;expires=" + new Date(0).toUTCString();
  }
}
