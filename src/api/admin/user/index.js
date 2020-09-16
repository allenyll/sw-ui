import request from '@/utils/request'

const path = '/api-sys/user/'

export function page(query) {
  return request({
    url: path + 'page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: path + 'add',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: path + id,
    method: 'get'
  })
}

export function getDepotObj(id) {
  return request({
    url: '/api-sys/depot/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: path + id,
    method: 'delete',
    params: {
      eq_pk_user_id: id
    }
  })
}

export function putObj(id, obj) {
  return request({
    url: path + id,
    method: 'put',
    data: obj
  })
}

export function getRoleList(id) {
  return request({
    url: '/api-sys/role/getRoleList/' + id,
    method: 'get'
  })
}

export function setRoles(id, obj) {
  return request({
    url: path + 'setRoles',
    method: 'post',
    data: {
      'ids': obj,
      'id': id
    }
  })
}

export function updateStatus(params) {
  return request({
    url: path + 'updateStatus',
    method: 'post',
    data: params
  })
}

