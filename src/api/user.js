import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/admin/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/getAdminInfo',
    method: 'get',
    data: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}