import Vue from 'vue'
import Router from 'vue-router'
import { apolloClient } from './plugins/apollo'
import ADMIN_GET_ONE from '@/graphql/Admin/GetOne.graphql'

const BoxLayout = import('@/layouts/Box.vue')
const DashLayout = import('@/layouts/Dash.vue')

const Login = import('@/views/Login.vue')
const Reset = import('@/views/Reset.vue')

const Home = import('@/views/Home.vue')
const Manage = import('@/views/Manage.vue')
const Sudo = import('@/views/Sudo.vue')

const Null = import('@/views/Null.vue')

const AUTH_BYPASS = !!process.env.AUTH_BYPASS

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/home',
      component: DashLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'home',
          name: 'home',
          component: Home
        },
        {
          path: 'manage',
          name: 'manage',
          component: Manage,
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
          path: 'reset',
          name: 'reset',
          component: Reset
        },
        {
          path: 'sudo',
          name: 'sudo',
          component: Sudo
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
    return next()
  }

  if (to.matched.some(v => v.meta.requiresAuth)) {
    const userData = await getUserData()

    if (userData != null) {
      if (to.matched.some(v => v.meta.requiresPrivilegeFull) && userData.privilege !== 'FULL') {
        return next('/')
      }

      return next()
    }

    return next('/login')
  }

  return next()
})

/** Gets the session user data, multiple calls is fine since apollo caches it */
async function getUserData () {
  try {
    // Get self data, calling AMIN_GET_ONE without id gets current session data
    const { data: { admin } } = await apolloClient.mutate({
      mutation: ADMIN_GET_ONE
    })

    return admin
  } catch {
    return undefined
  }
}

export default router
