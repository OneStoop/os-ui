import '@babel/polyfill'
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './plugins/vuetify'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { store } from './store'
import firebase from 'firebase'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

// import VueMoment from 'vue-moment'
Vue.use(Vuetify, {
  theme: { primary: '#00B0FF', secondary: '#40C4FF', accent: '#64DD17', error: '#f44336', warning: '#ffeb3b', info: '#2196f3', success: '#4caf50' }
})
// Vue.use(VueMoment)

firebase.initializeApp(process.env.FIREBASE)

Vue.config.productionTip = process.env.NODE_ENV

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
