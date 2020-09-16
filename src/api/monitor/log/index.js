import request from '@/utils/request'

const path = '/api-user/log/'

export function page(query) {
  return request({
    url: path + 'page',
    method: 'get',
    params: query
  })
}

export function getObj(id) {
  return request({
    url: path + id,
    method: 'get'
  })
}

