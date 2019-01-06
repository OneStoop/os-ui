import Vue from 'vue'
// import Router from 'vue-router'
import VueRouter from 'vue-router'
import firebase from 'firebase'

const routerOptions = [
  { path: '/', component: 'Landing' },
  { path: '/feed', component: 'Feed', meta: { requiresAuth: true } },
  { path: '/help', component: 'Help' },
  { path: '/help/:item', component: 'Help' },
  { path: '/home', component: 'Home', meta: { requiresAuth: true } },
  { path: '/landing', component: 'Landing2' },
  { path: '/signin', component: 'Signin', meta: { requiresNoAuth: true } },
  { path: '/signout', component: 'Signout', meta: { requiresAuth: true } },
  { path: '/signup', component: 'Signup', meta: { requiresNoAuth: true } },
  { path: '/profile/:email', component: 'Profile', meta: { requiresAuth: true } },
  { path: '/tryagain', component: 'Tryagain' },
  { path: '*', component: 'NotFound' }
]

const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(`@/components/${route.component}.vue`)
  }
})

const router = new VueRouter({
  mode: 'history',
  routes // short for `routes: routes`
})

Vue.use(VueRouter)

// const router = new Router({
//   mode: 'history',
//   routes
// })

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresNoAuth = to.matched.some(record => record.meta.requiresNoAuth)
  // const isAuthenticated = firebase.auth().currentUser
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      console.log('is logged in')
      const isAuthenticated = true
      if (requiresNoAuth && isAuthenticated) {
        next('/feed')
      } else { next() }
    } else {
      // No user is signed in.
      console.log('not logged in')
      const isAuthenticated = false
      if (requiresAuth && !isAuthenticated) {
        next('/signin')
      } else { next() }
    }
  })
})

export default router
