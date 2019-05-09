import axios from 'axios'
import moment from 'moment'
export default {
  data: () => ({
    editDialog: false,
    editPostID: null,
    deletePostDialog: false,
    deletePostID: null,
    dialog: false,
    imageIDs: [],
    imgDialog: false,
    imgDialogImages: [],
    items: [{ title: 'Edit Post' }, { title: 'Delete Post' }],
    postData: '',
    newVisibility: 'friends',
    removeImages: [],
    newImages: [],
    isDestroying: false,
    uploadFieldName: 'file',
    window: {
      width: 0,
      height: 0
    }
  }),
  methods: {
    cancleEdit: function () {
      this.editDialog = false
      this.postData = ''
      this.imageIDs = []
      this.removeImages = []
      this.newImages = []
      this.newVisibility = 'friends'
      this.editPostID = null
    },
    autoRefreshToken () {
      this.$store.dispatch('refreshToken')
    },
    canclePost () {
      this.postData = null
      this.dialog = false
      this.imageIDs = []
      this.newVisibility = 'friends'
    },
    openEditPost (id) {
      this.postData = this.$store.getters.getPostById(id).body
      this.newVisibility = this.$store.getters.getPostById(id).visibility

      this.imageIDs = this.$store.getters.getPostById(id).images
      this.editPostID = id
      this.editDialog = true
    },
    openDeletePost (id) {
      this.deletePostID = id
      this.deletePostDialog = true
    },
    deletePost () {
      this.$store.dispatch('deletePosts', this.deletePostID)
      this.deletePostDialog = false
    },
    editPost () {
      function doEditPost (vm, count) {
        var auth = {
          headers: { 'Content-Type': 'application/json', 'Authorization': vm.$store.state.token }
        }
        axios.put(process.env.VUE_APP_API_SERVER + 'posts?postID=' + vm.editPostID, { 'post': vm.postData, 'removeImages': vm.removeImages, 'newImages': vm.newImages, 'visibility': vm.newVisibility }, auth)
          .then(response => {
            var newPost = response.data
            newPost.postControl = [{ title: 'edit' }, { title: 'delete' }]
            vm.$store.commit('editPost', newPost) // ???
            vm.editDialog = false
            vm.postData = ''
            vm.imageIDs = []
            vm.removeImages = []
            vm.newImages = []
            vm.newVisibility = 'friends'
            vm.editPostID = null
          })
          .catch(function (error) {
            if (error.response) {
              if (error.response.data.status === 'expired' && count < 3) {
                count++
                vm.$store.dispatch('refreshToken')
                setTimeout(doEditPost(vm, count), 1000)
              } else if (error.response.status >= 400 && count < 3) {
                count++
                setTimeout(doEditPost(vm, count), 1000)
              } else {
                vm.editDialog = false
                vm.postData = ''
                vm.imageIDs = []
                vm.removeImages = []
                vm.newImages = []
                vm.newVisibility = 'friends'
                vm.editPostID = null
              }
            } else {
                console.log(error)
                vm.editDialog = false
                vm.postData = ''
                vm.imageIDs = []
                vm.removeImages = []
                vm.newImages = []
                vm.newVisibility = 'friends'
                vm.editPostID = null
            }
          })
      }

      var count = 0
      doEditPost(this, count)
    },
    launchFilePicker () {
      this.$refs.file.click()
    },
    launchEditFilePicker () {
      this.$refs.editFile.click()
    },
    onFileChange (fieldName, file) {
      function doPost (vm, f) {
        const formData = new FormData()
        formData.append('file', f, f.name)
        var auth = {
          headers: { 'Content-Type': 'application/json', 'Authorization': vm.$store.state.token }
        }
        axios.post(process.env.VUE_APP_API_SERVER + 'images', formData, auth)
          .then(response => {
            vm.imageIDs.push({ 'url': response.data.url, 'key': response.data.imageID })
          })
          .catch(function (error) {
          })
      }

      for (var i = 0; i < file.length; i++) {
        doPost(this, file[i])
      }
    },
    onEditfileChange (fieldName, file) {
      function doPost (vm, f) {
        const formData = new FormData()
        formData.append('file', f, f.name)
        var auth = {
          headers: { 'Content-Type': 'application/json', 'Authorization': vm.$store.state.token }
        }
        axios.post(process.env.VUE_APP_API_SERVER + 'images', formData, auth)
          .then(response => {
            vm.imageIDs.push({ 'url': response.data.url, 'key': response.data.imageID })
            vm.newImages.push({ 'url': response.data.url, 'key': response.data.imageID })
          })
          .catch(function (error) {
          })
      }

      for (var i = 0; i < file.length; i++) {
        doPost(this, file[i])
      }
    },
    postDate (utcdate) {
      return moment.unix(utcdate).fromNow()
    },
    postComment (id) {
      var elementPos = this.$store.getters.posts.findIndex(p => p.id === id)
      function doPost (vm, count) {
        var auth = {
          headers: { 'Content-Type': 'application/json', 'Authorization': vm.$store.state.token }
        }

        axios.post(process.env.VUE_APP_API_SERVER + 'comments',
          { 'comment': vm.$store.getters.posts[elementPos].newComment,
            'post_id': id
          }, auth)
          .then(response => {
            vm.$store.commit('addNewComment', { comment: response.data, elementPos: elementPos })
          })
          .catch(function (error) {
            if (error.response.data.status === 'expired' && count < 3) {
              count++
              vm.$store.dispatch('refreshToken')
              setTimeout(doPost(count), 1000)
            } else if (error.response.status >= 400 && count < 3) {
              count++
              setTimeout(doPost(count), 1000)
            } else {
              vm.$store.commit('cleanNewComment', elementPos)
            }
          })
      }
      let vm = this
      var count = 0
      doPost(vm, count)
    },
    postPost () {
      function doPost (vm, count) {
        var auth = {
          headers: { 'Content-Type': 'application/json', 'Authorization': vm.$store.state.token }
        }
        var keys = []
        for (var i = 0; i < vm.imageIDs.length; i++) {
          keys.push(vm.imageIDs[i].key)
        }
        axios.post(process.env.VUE_APP_API_SERVER + 'posts', { 'post': vm.postData, 'images': keys, 'visibility': vm.newVisibility }, auth)
          .then(response => {
            var newPost = response.data
            newPost.postControl = [{ title: 'edit' }, { title: 'delete' }]
            vm.$store.commit('addNewPost', newPost)
            vm.newVisibility = 'friends'
            vm.postData = null
            vm.dialog = false
            vm.imageIDs = []
            vm.newVisibility = 'friends'
          })
          .catch(function (error) {
            if (error.response.data.status === 'expired' && count < 3) {
              count++
              vm.$store.dispatch('refreshToken')
              setTimeout(doPost(count), 1000)
            } else if (error.response.status >= 400 && count < 3) {
              count++
              setTimeout(doPost(count), 1000)
            } else {
              vm.postData = null
              vm.dialog = false
              vm.imageIDs = []
              vm.newVisibility = 'friends'
            }
          })
      }

      var count = 0
      doPost(this, count)
    },
    removedEvent (image) {
      function deleteFile (vm, count, key) {
        var auth = {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': vm.$store.getters.token }
        }
        axios
          .delete(process.env.VUE_APP_API_SERVER + 'images?fileName=' + key, auth)
          .then(response => {
            for (var i = 0; i < vm.imageIDs.length; i++) {
              if (vm.imageIDs[i].key === key) {
                vm.imageIDs.splice(i, 1)
              }
            }
          })
          .catch(function (e) {
            if (e.response.data.status === 'expired' && count < 3) {
              count++
              vm.$store.dispatch('refreshToken')
              setTimeout(deleteFile(vm, count, image), 1000)
            } else if (e.response.status >= 400 && count < 3) {
              count++
              setTimeout(deleteFile(vm, count, image), 1000)
            } else {
            }
          })
      }
      let vm = this
      var count = 0
      deleteFile(vm, count, image.key)
    },
    removedEditEvent (image) {
      this.removeImages.push(image)
      for (var i = 0; i < this.imageIDs.length; i++) {
        if (this.imageIDs[i].key === image.key) {
          this.imageIDs.splice(i, 1)
          for (var x = 0; i < this.newImages.length; i++) {
            if (this.newImages[x].hasOwnProperty()) {
              this.newImages.splice(x, 1)
            }
          }
        }
      }
    },
    scroll () {
      window.onscroll = () => {
        let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight

        if (bottomOfWindow) {
          this.addPosts()
        }
      }
    },
    showImgDialog (images) {
      this.imgDialogImages = images
      this.imgDialog = true
    },
    handleResize () {
      this.window.width = window.innerWidth
      this.window.height = window.innerHeight
    }
  }
}
