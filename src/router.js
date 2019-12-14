import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

import BoxLayout from '@/layouts/Box.vue'
import DashLayout from '@/layouts/Dash.vue'

import Login from '@/views/Login.vue'
import Forgot from '@/views/Forgot.vue'
import Reset from '@/views/Reset.vue'

import Dashboard from '@/views/Dashboard.vue'
import Jobs from '@/views/Jobs.vue'
import Customers from '@/views/Customers.vue'
import Staffs from '@/views/Staffs.vue'
import Admins from '@/views/Admins.vue'

import Null from '@/views/Null.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      component: DashLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: Dashboard
        },
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
          path: 'staffs',
          name: 'staffs',
          component: Staffs
        },
        {
          path: 'admins',
          name: 'admins',
          component: Admins
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
  if (to.matched.some(v => v.meta.requiresAuth)) {
    await store.dispatch('checkUser').catch(() => {})

    if (store.getters.isAuthed) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
