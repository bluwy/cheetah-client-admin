import Vue from 'vue'
import Router from 'vue-router'

import BoxLayout from '@/layouts/Box.vue'
import DashLayout from '@/layouts/Dash.vue'

import Login from '@/views/Login.vue'
import Forgot from '@/views/Forgot.vue'

import Dashboard from '@/views/Dashboard.vue'
import Jobs from '@/views/Jobs.vue'
import Customers from '@/views/Customers.vue'
import Staffs from '@/views/Staffs.vue'
import Admins from '@/views/Admins.vue'

import Null from '@/views/Null.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      component: DashLayout,
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
