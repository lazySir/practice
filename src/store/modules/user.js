import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { anyRoutes, resetRouter, asyncRoutes,constantRoutes } from "@/router";
import router from '@/router'
const getDefaultState = () => {
  return {
    //获取token
    token: getToken(),
    //存储用户名
    name: "",
    //存储用户头像
    avatar: "",
    //存储用户权限
    roles: [],
    //存储route
    routes: [],
    //对比之后[项目中已有的异步路由，与服务器返回的标记信息进行对比最终需要展示的异步路由]
    resultAsyncRoutes: [],
    //最终要展示给用户的路由
    resultsAllRoutes:[]
  };
};

const state = getDefaultState();

const mutations = {
  //重置state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  //存储token
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  //存储用户信息
  SET_USERINFO: (state, payload) => {
    //设置用户名
    state.name = payload.name;
    //设置用户头像
    state.avatar = payload.avatar;
    //菜单权限的标记
    state.routes = payload.routes;
    //角色
    state.roles = payload.roles;
  },
  //异步路由
  SET_ROUTES: (state, payload) => {
    state.routes = payload;
  },
  //最终计算出来的异步路由
  SET_RESULTASYNCROUTES: (state, payload) => {
    //这个是比对之后要展示的异步路由
    state.resultAsyncRoutes = payload;
    //将所有的路由进行合并 常量路由 异步路由 任意路由
    state.resultsAllRoutes=constantRoutes.concat(state.resultAsyncRoutes,anyRoutes)
    router.addRoutes(state.resultsAllRoutes)//这里是将计算好的路由添加进router
  },
};
//根据adminInfo中返回的routes权限 返回出所有path值
const getRoutes = function (payload) {
  var routes = payload;
  var len = routes.length;
  var routeList = [];
  //从routes中获取所有path值并添加到routeList中
  for (var i = 0; i < len; i++) {
    routeList.push(routes[i].path);
    if (routes[i].children) {
      var len2 = routes[i].children.length;
      for (var j = 0; j < len2; j++) {
        routeList.push(routes[i].children[j].path);
      }
    }
  }
  return routeList;
};
//异步路由和后端返回的路由进行对比 返回最终展示的路由
const computedAsyncRoutes = function (asyncRoutes, routes) {
  return asyncRoutes.filter((item) => {
    if (routes.indexOf(item.name) != -1) {
      //代表要展示
      //递归:别忘记还有2，3，4，5级路由
      if (item.children&&item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes);
      }
      return true;
    }
  });
};
const actions = {
  //登录业务
  async login(context, payload) {
    //解构出用户名密码
    const { username, password } = payload;
    let result = await login({ username: username.trim(), password: password });
    if (result.code == 200) {
      //将token存在state中
      context.commit("SET_TOKEN", result.data.token);
      //将token存在cookie中
      setToken(result.data.token);
      return "success";
    } else {
      return Promise.reject(new Error("faile"));
    }
  },

  //获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then((response) => {
          //获取用户信息  返回的数据包含：用户名name,用户头像：avatar,routes[返回的标志：不同的用户应该展示哪些菜单]、roles（用户角色信息）、buttons[按钮的信息：做按钮权限用的标记]
          const { data } = response;

          if (!data) {
            return reject("Verification failed, please Login again.");
          }
          commit("SET_USERINFO", data);
          commit("SET_ROUTES", getRoutes(data.routes));
          //存储异步路由
          commit(
            "SET_RESULTASYNCROUTES",
            computedAsyncRoutes(asyncRoutes, state.routes)
          );
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken(); // must remove  token  first
          resetRouter();
          commit("RESET_STATE");
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
