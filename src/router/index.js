import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/sys',
    component: Layout,
    name: '系统管理',
    meta: { title: '系统管理', icon: 'sw-system', perms: 'sys:sys' },
    icon: 'setting',
    children: [{
      path: 'user',
      component: () => import('@/views/admin/user/index'),
      name: '用户管理',
      meta: { title: '用户管理', icon: 'sw-user', perms: 'sys:user:user', noCache: true }
    }, {
      path: 'menu',
      component: () => import('@/views/admin/menu/index'),
      name: '菜单管理',
      meta: { title: '菜单管理', icon: 'sw-menu', perms: 'sys:menu:menu', noCache: true }
    }, {
      path: 'depot',
      component: () => import('@/views/admin/depot/index'),
      name: '组织管理',
      meta: { title: '组织管理', icon: 'sw-depot', perms: 'sys:depot:depot', noCache: true }
    }, {
      path: 'role',
      component: () => import('@/views/admin/role/index'),
      name: '角色管理',
      meta: { title: '角色管理', icon: 'sw-role', perms: 'sys:role:role', noCache: true }
    }]
  }
]
