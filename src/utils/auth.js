import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

// export function removeToken() {
//   return Cookies.remove(TokenKey)
// }

export function setName(name) {
  return Cookies.set("name", name)
}
export function setAvatar(avatar){
  return Cookies.set("avatar",avatar)
}

export function setRoutes(routes) {
  return Cookies.set("routes", routes)
}

export function setButtons(buttons) {
  return Cookies.set("buttons", buttons)
}
export function getName() {
  return Cookies.get("name")
}
export function getAvatar(){
  return Cookies.get("avatar")
}
export function getRoutes() {
  return Cookies.get("routes")
}
export function getButtons() {
  return Cookies.get("buttons")
}
export function removeAll(){
  return clearAllCookie()
}
//定义一个清除所有cookie的方法
function clearAllCookie(){
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
  if (keys) {
    for (var i = keys.length; i--;)
      document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
  }
}