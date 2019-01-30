import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import axios from 'axios'
import firebase from 'firebase'
import router from '@/router'

Vue.use(Vuex)

var qs = require('qs')

// var storage = firebase.storage()

const vuexLocalStorage = new VuexPersist({
  key: 'onestoop', // The key to store the state on in the storage provider.
  storage: window.localStorage // or window.sessionStorage or localForage
  // Function that passes the state and returns the state with only the objects you want to store.
  // reducer: state => state,
  // Function that passes a mutation and lets you decide if it should update the state in localStorage.
  // filter: mutation => (true)
})

Vue.use(Vuex)

const store = new Vuex.Store({
  plugins: [vuexLocalStorage.plugin],
  state: {
    user: null,
    post: null,
    profile: null,
    token: null,
    error: null,
    loading: false,
    baseurl: 'http://localhost:8080',
    posts: []
  },
  mutations: {
    setBaseurl (state, payload) {
      state.baseurl = payload
    },
    setUser (state, payload) {
      state.user = payload
    },
    setProfile (state, payload) {
      state.profile = payload
    },
    setToken (state, payload) {
      state.token = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setPosts (state, payload) {
      state.posts = payload
    },
    addPosts (state, payload) {
      state.posts.splice(state.posts.length, 0, payload)
    },
    editPost (state, payload) {
      for (var i = 0; i < store.state.posts.length; i++) {
        if (payload === store.state.posts[i].id) {
          store.state.posts[i] = payload
          break
        }
      }
    },
    cleanNewComment (state, payload) {
      state.posts[payload].newComment = ''
    },
    addNewComment (state, payload) {
      state.posts[payload.elementPos].newComment = ''
      state.posts[payload.elementPos].comments.push(payload.comment)
    },
    addNewPost (state, payload) {
      state.posts.unshift(payload)
    },
    clearPosts (state, payload) {
      state.posts = []
    }
  },
  actions: {
    refreshToken ({ commit }) {
      firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
        commit('setToken', idToken)
      }).catch(function (error) {
      })
    },
    deletePosts ({ commit }, payload) {
      var auth = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': store.state.token }
      }
      axios.delete(process.env.VUE_APP_API_SERVER + 'posts?postID=' + payload, auth)
        .then(response => {
          for (var i = 0; i < store.state.posts.length; i++) {
            if (payload === store.state.posts[i].id) {
              store.state.posts.splice(i, 1)
              break
            }
          }
        })
        .catch(function (error) {
        })
    },
    loadPosts ({ commit }, payload) {
      commit('setPosts', payload)
    },
    userSignUp ({ commit }, payload) {
      commit('setLoading', true)
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(firebaseUser => {
          commit('setUser', { email: firebaseUser.user.email })
          commit('setLoading', false)
          commit('setToken', firebaseUser.user.qa)
          axios.post(process.env.VUE_APP_API_SERVER + `users?token=` + firebaseUser.user.qa, {
            body: ''
          })
            .then(response => {})
            .catch(e => {
              var user = firebase.auth().currentUser
              user.delete().then(function () {
                // User deleted.
              }).catch(function (error) {
              })
              commit('setUser', null)
              router.push('/tryagain')
              this.errors.push(e)
            })
          router.push('/feed')
        })
        .catch(error => {
          commit('setError', error.message)
          commit('setLoading', false)
        })
    },
    userSignIn ({ commit }, payload) {
      commit('setLoading', true)
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function () {
          return firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
            .then(firebaseUser => {
              commit('setUser', { email: firebaseUser.user.email, uid: firebaseUser.user.uid })
              commit('setToken', firebaseUser.user.ra)
              commit('setLoading', false)
              commit('setError', null)
              router.push('/feed')
            })
            .catch(error => {
              commit('setError', error.message)
              commit('setLoading', false)
              firebase.auth().signOut()
              commit('setUser', null)
            })
        }).then(function () {
          var auth = {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': store.state.token }
          }
          axios.get(process.env.VUE_APP_API_SERVER + 'users?email=' + store.state.user.email, auth)
            .then(function (response) {
              commit('setProfile', response.data)
            })
            .catch(function (error) {
              firebase.auth().signOut()
              commit('setUser', null)
            })
        })
        .catch(function (error) {
          // Handle Errors here.
          commit('setUser', null)
        })
    },
    postPost ({ commit }, payload) {
      commit('setLoading', true)
      function doPost ({ commit }, payload, count) {
        var auth = {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': store.state.token }
        }
        axios.post(process.env.VUE_APP_API_SERVER + 'posts', qs.stringify({ 'post': payload.postData }), auth)
          .then(function (response) {
            commit('setLoading', false)
            router.push('/feed')
          })
          .catch(function (error) {
            if (error.response.data.status === 'expired' && count < 3) {
              count++
              store.dispatch('refreshToken')
              setTimeout(doPost({ commit }, payload, count), 1000)
            } else if (error.response.status >= 400 && count < 3) {
              count++
              commit('setLoading', false)
              setTimeout(doPost({ commit }, payload, count), 1000)
            } else {
              commit('setLoading', false)
              router.push('/feed')
            }
          })
      }
      var count = 0
      doPost({ commit }, payload, count)
    },
    autoSignIn ({ commit }, payload) {
      commit('setUser', { email: payload.email })
    },
    userSignOut ({ commit }) {
      firebase.auth().signOut()
      commit('setUser', null)
      commit('setProfile', null)
      commit('clearPosts', null)
      commit('setToken', null)
      router.push('/')
    }
  },
  getters: {
    isAuthenticated: state => {
      return state.user !== null && state.user !== undefined
    },
    token: state => {
      if (state.user !== null && state.user !== undefined && state.user !== null && state.token !== undefined) {
        return state.token
      } else {
        return null
      }
    },
    getPostById: (state) => (id) => {
      return state.posts.find(post => post.id === id)
    },
    posts: state => {
      return state.posts
    },
    profile: state => {
      return state.profile
    },
    user: state => {
      return state.user
    },
    baseurl: state => {
      return state.baseurl
    }
  }
})
export default store
