import Vue from 'vue'
// import Router from 'vue-router'
import VueRouter from 'vue-router'
// import firebase from 'firebase'
import store from '../store'

// function loadView (view) {
//   return () => import(/* webpackChunkName: "view-[request]" */ `@/components/${view}.vue`)
// }

function loadView(view) {
  return () => import(/* webpackChunkName: "view-[request]" */ `@/views/${view}.vue`)
}
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: loadView('Landing') },
    { path: '/feed', component: loadView('Feed'), meta: { requiresAuth: true } },
    { path: '/help', component: loadView('Help') },
    { path: '/help/:item', component: loadView('Help') },
    { path: '/signin', component: loadView('Signin'), meta: { requiresNoAuth: true } },
    { path: '/signout', component: loadView('Signout'), meta: { requiresAuth: true } },
    { path: '/signup', component: loadView('Signup'), meta: { requiresNoAuth: true } },
    { path: '/profile/:email', component: loadView('Profile'), meta: { requiresAuth: true } },
    { path: '/tryagain', component: loadView('Tryagain') },
    { path: '*', component: loadView('NotFound') }
  ]
})

Vue.use(VueRouter)

// router.beforeEach((to, from, next) => {
//   const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
//   const requiresNoAuth = to.matched.some(record => record.meta.requiresNoAuth)
//   // const isAuthenticated = firebase.auth().currentUser
//   firebase.auth().onAuthStateChanged(function (user) {
//     if (user) {
//       // User is signed in.
//       console.log('is logged in')
//       const isAuthenticated = true
//       if (requiresNoAuth && isAuthenticated) {
//         next('/feed')
//       } else { next() }
//     } else {
//       // No user is signed in.
//       console.log('not logged in')
//       const isAuthenticated = false
//       if (requiresAuth && !isAuthenticated) {
//         next('/signin')
//       } else { next() }
//     }
//   })
// })

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isAuthenticated) {
      next()
      return
    }
    next('/signin') 
  } else {
    next() 
  }
})
export default router
