import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
// import firebase from 'firebase'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(Vuetify)

var fbConfig = {
    apiKey: process.env.VUE_APP_FIREBASE_APIKEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTHDOMAIN,
    projectId: process.env.VUE_APP_FIREBASE_PROJECTID
}
firebase.initializeApp(fbConfig)

Vue.config.productionTip = process.env.NODE_ENV

store.state.baseurl = process.env.VUE_APP_BASEURL
/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   store,
//   render: h => h(App)
// })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
