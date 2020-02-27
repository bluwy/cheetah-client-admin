import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

import BoxLayout from '@/layouts/Box.vue'
import DashLayout from '@/layouts/Dash.vue'

import Login from '@/views/Login.vue'
import Forgot from '@/views/Forgot.vue'
import Reset from '@/views/Reset.vue'

import Jobs from '@/views/Jobs.vue'
import Customers from '@/views/Customers.vue'
import Companies from '@/views/Companies.vue'
import Staffs from '@/views/Staffs.vue'
import Admins from '@/views/Admins.vue'

import Null from '@/views/Null.vue'

const AUTH_BYPASS = !!process.env.AUTH_BYPASS

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/jobs',
      component: DashLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'jobs',
          name: 'jobs',
          component: Jobs
        },
        {
          path: 'customers',
          name: 'customers',
          component: Customers
        },
        {
          path: 'companies',
          name: 'companies',
          component: Companies,
          meta: { requiresPrivilegeFull: true }
        },
        {
          path: 'staffs',
          name: 'staffs',
          component: Staffs,
          meta: { requiresPrivilegeFull: true }
        },
        {
          path: 'admins',
          name: 'admins',
          component: Admins,
          meta: { requiresPrivilegeFull: true }
        }
      ]
    },
    {
      path: '/',
      component: BoxLayout,
      children: [
        {
          path: 'login',
          name: 'login',
          component: Login
        },
        {
          path: 'forgot',
          name: 'forgot',
          component: Forgot
        },
        {
          path: 'reset',
          name: 'reset',
          component: Reset
        }
      ]
    },
    {
      path: '*',
      name: '404',
      component: Null
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (AUTH_BYPASS) {
    next()
  }

  if (to.matched.some(v => v.meta.requiresAuth)) {
    await store.dispatch('checkUser').catch(() => {})

    if (store.getters.isAuthed) {
      if (to.matched.some(v => v.meta.requiresPrivilegeFull) && !store.getters.isPrivilegeFull) {
        next('/')
      } else {
        next()
      }
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
