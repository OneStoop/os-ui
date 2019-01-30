<template>
  <v-container fluid grid-list-md>
    <v-layout
      align-start
      wrap
    >
      <v-flex d-flex md3></v-flex>
      <v-flex d-flex md6>
        <v-layout justify-center wrap>
          <v-flex
            v-for="post in this.$store.state.posts"
            :key="post.title"
            xs12
          >
            <v-card>
              <v-toolbar flat card color='white'>
                <v-list two-line subheader>
                  <v-list-tile :to="'/profile/' + post.email">
                    <v-list-tile-content>
                      <v-list-tile-title>
                        {{ post.name }}
                      </v-list-tile-title>
                      <v-list-tile-sub-title>{{ postDate(post.created_date) }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
                <v-spacer></v-spacer>
                <v-menu bottom left>
                  <v-btn
                    slot="activator"
                    icon
                  >
                    <v-icon>more_vert</v-icon>
                  </v-btn>
                  <v-list>
                    <div
                      v-for="(item, i) in post.postControl"
                      :key="i"
                    >
                        <v-btn color="info" flat v-if="item.title === 'edit'" @click="openEditPost(post.id)">Edit Post</v-btn>
                        <v-btn color="info" flat v-if="item.title === 'delete'" @click="openDeletePost(post.id)">Delete Post</v-btn>
                    </div>
                  </v-list>
                </v-menu>
              </v-toolbar>
              <v-container grid-list-lg>
                <v-layout row>
                  <v-flex lg12>
                    <div v-html="post.body" style="padding-left: 10px"></div>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex lg12>
                    <div v-if="post.images.length === 1">
                      <center>
                        <img :src="post.images[0].url" style="max-width: 100%;" @click.stop="showImgDialog(post.images)" />
                      </center>
                    </div>
                    <div v-else-if="post.images.length > 1">
                      <v-carousel :cycle=false light>
                        <v-carousel-item v-for="(item,i) in post.images" :key="i">
                          <center>
                            <img :src="item.url" style="max-width: 100%;" @click.stop="showImgDialog(post.images)">
                          </center>
                        </v-carousel-item>
                      </v-carousel>
                    </div>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex md12>
                    <div
                      v-for="comment in post.comments"
                      :key="comment.id"
                      color="grey lighten-5"
                      style="border-bottom: 1px solid black;"
                    >
                        <v-avatar size="20px">
                          <v-icon>account_circle</v-icon>
                        </v-avatar>

                        <v-btn
                          flat
                          round
                          small
                          :to="'/profile/' + comment.email"
                          color="primary"
                        >
                          <b>{{ comment.userName }}</b>
                        </v-btn>

                        {{ comment.comment }}
                      <p class="comment font-weight-thin" style="color:#2196F3;">
                      <b>Like - Reply -</b> {{ postDate(comment.created_date) }}
                      </p>
                    </div>
                    <v-divider></v-divider>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex>
                  <form @submit.prevent="postComment(post.id)" :ref="'newCommentForm_' + post.id" :id="'newCommentForm_' + post.id">
                    <v-container grid-list-lg>
                      <v-layout row wrap>
                        <v-flex align-content-center=true lg1>
                          <br>
                          <v-avatar size="20px">
                            <v-icon>account_circle</v-icon>
                          </v-avatar>
                        </v-flex>
                        <v-flex md11>
                          <v-text-field
                            :name="'newComment_' + post.id"
                            label="Add a comment"
                            :id="'newComment_' + post.id"
                            rows=1
                            auto-grow
                            v-model="post.newComment"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </form>
                  </v-flex>
                </v-layout>
              </v-container>
              <v-card-actions>

              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex d-flex md3></v-flex>
    </v-layout>

    <v-btn
      fab
      bottom
      right
      color="#2196F3"
      fixed
      @click.stop="dialog = !dialog"
    >
      <div class="display-1">+</div>
    </v-btn>

    <v-dialog
      v-model="imgDialog"
      fullscreen
      hide-overlay
    >
      <v-card dark height="100%">
        <v-toolbar dark>
          <v-btn
            color="#2196F3"
            @click="imgDialog = false"
          >
            Close
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-carousel dark hide-delimiters :cycle=false :height="window.height - (window.height * .15)">
            <v-carousel-item
              v-for="(item,i) in this.imgDialogImages"
              :key="i"
            >
              <center><v-img :src="item.url" contain :height="window.height - (window.height * .15)"></v-img></center>
            </v-carousel-item>
          </v-carousel>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deletePostDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Are you sure?</v-card-title>
        <v-card-text>If you delete this post it can not be recovered.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click="deletePostDialog = false">Cancel</v-btn>
          <v-btn color="green darken-1" flat @click="deletePost">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog" width="800px">
      <v-card>
        <form @submit.prevent="postPost" ref="newPost">
        <v-toolbar>
          <v-toolbar-title>
            New Post
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon href="/help/newPost" target="_blank">
            <v-icon>help</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container>
          <v-layout row wrap>
            <v-flex xs2>
             <v-subheader>
               <v-avatar size="32px" tile>
                 <v-icon>account_circle</v-icon>
               </v-avatar>
             </v-subheader>
            </v-flex>
            <v-flex xs10>
              <v-textarea
                name="input-1"
                label="Say something"
                id="testing"
                multi-line
                v-model="postData"
              ></v-textarea>
            </v-flex>

            <v-flex xs12>
              <v-card>
                <input
                  type="file"
                  ref="file"
                  multiple="multiple"
                  :name="uploadFieldName"
                  @change="onFileChange($event.target.name, $event.target.files)"
                  style="display:none"
                >
                <v-container fluid grid-list-md>
                  <v-layout row wrap>
                    <v-flex
                      xs2
                      v-for="(img, i) in this.imageIDs"
                      :key="i"
                    >
                      <v-card>
                        <v-img
                          :src="img.url"
                          height="100px"
                        >
                        </v-img>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn small icon @click="removedEvent(img)"><v-icon>delete_outline</v-icon></v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </v-flex>

            <v-flex xs12 align-center justify-space-between>
              <v-btn small round @click="launchFilePicker()"><v-icon>insert_photo</v-icon>Photo/Video</v-btn>
              <v-btn small round><v-icon>person_add</v-icon>Tags</v-btn>
              <v-btn small round><v-icon>gif</v-icon>GIF</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-select
            :items='["friends", "followers", "public"]'
            v-model="newVisibility"
            label="Visibility"
            single-line
            hint="Visibility"
            persistent-hint
          ></v-select>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="canclePost">Cancel</v-btn>
          <v-btn color="primary" type="submit" :disabled="this.$store.state.loading">Post</v-btn>
        </v-card-actions>
        </form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editDialog" width="800px">
      <v-card>
        <form @submit.prevent="editPost" ref="editPost">
        <v-toolbar>
          <v-toolbar-title>
            Edit Post
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon href="/help/newPost" target="_blank">
            <v-icon>help</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs2>
             <v-subheader>
               <v-avatar size="32px" tile>
                 <v-icon>account_circle</v-icon>
               </v-avatar>
             </v-subheader>
            </v-flex>
            <v-flex xs10>
              <v-textarea
                name="input-1"
                label="Say something"
                id="testing"
                multi-line
                v-model="postData"
              ></v-textarea>
            </v-flex>

            <v-flex xs12>
              <v-card>
                <input
                  type="file"
                  ref="editFile"
                  multiple="multiple"
                  :name="uploadFieldName"
                  @change="onEditfileChange($event.target.name, $event.target.files)"
                  style="display:none"
                >
                <v-container fluid grid-list-md>
                  <v-layout row wrap>
                    <v-flex
                      xs2
                      v-for="(img, i) in this.imageIDs"
                      :key="i"
                    >
                      <v-card>
                        <v-img
                          :src="img.url"
                          height="100px"
                        >
                        </v-img>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn small icon @click="removedEditEvent(img)"><v-icon>delete_outline</v-icon></v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </v-flex>

            <v-flex xs12 align-center justify-space-between>
              <v-btn small round @click="launchEditFilePicker()"><v-icon>insert_photo</v-icon>Photo/Video</v-btn>
              <v-btn small round><v-icon>person_add</v-icon>Tags</v-btn>
              <v-btn small round><v-icon>gif</v-icon>GIF</v-btn>
            </v-flex>

          </v-layout>
        </v-container>
        <v-card-actions>
          <v-select
            :items='["friends", "followers", "public"]'
            v-model="newVisibility"
            label="Visibility"
            single-line
            hint="Visibility"
            persistent-hint
          ></v-select>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="cancleEdit">Cancel</v-btn>
          <v-btn color="primary" type="submit" :disabled="this.$store.state.loading">Submit</v-btn>
        </v-card-actions>
        </form>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import axios from 'axios'
// import firebase from 'firebase'
import moment from 'moment'
// import vue2Dropzone from 'vue2-dropzone'
// import 'vue2-dropzone/dist/vue2Dropzone.min.css'

export default {
  components: {
  },
  computed: {
  },
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
    addPosts () {
      console.log('adding posts')
      let vm = this
      var auth = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': vm.$store.state.token }
      }
      var endTime = this.$store.getters.posts[this.$store.getters.posts.length - 1].created_date
      axios.get(process.env.VUE_APP_API_SERVER + 'feed?endTime=' + endTime, auth)
        .then(response => {
          console.log(response.data.posts)
          for (var i = 0; i < response.data.posts.length; i++) {
            var incomingPosts = response.data.posts[i]
            incomingPosts.changed = false
            incomingPosts.newComment = ''
            if (incomingPosts.email === vm.$store.state.user.email) {
              incomingPosts.postControl = [{ title: 'edit' }, { title: 'delete' }]
            } else {
              incomingPosts.postControl = []
            }
            vm.$store.commit('addPosts', incomingPosts)
            // vm.posts.splice(vm.posts.length, 0, incomingPosts)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    autoRefreshToken () {
      this.$store.dispatch('refreshToken')
    },
    cancleEdit () {
      this.editDialog = false
      this.postData = ''
      this.imageIDs = []
      this.removeImages = []
      this.newImages = []
      this.newVisibility = 'friends'
      this.editPostID = null
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
      console.log(this.$store.getters.getPostById(id).images)
      this.imageIDs = this.$store.getters.getPostById(id).images
      this.editPostID = id
      this.editDialog = true
    },
    openDeletePost (id) {
      this.deletePostID = id
      this.deletePostDialog = true
    },
    deletePost () {
      console.log('deletePost')
      this.$store.dispatch('deletePosts', this.deletePostID)
      this.deletePostDialog = false
    },
    editPost () {
      console.log('editPost')
      function doEditPost (vm, count) {
        console.log('starting editPost')
        var auth = {
          headers: { 'Content-Type': 'application/json', 'Authorization': vm.$store.state.token }
        }
        console.log(vm.imagePaths)
        axios.put(process.env.VUE_APP_API_SERVER + 'posts?postID=' + vm.editPostID, { 'post': vm.postData, 'removeImages': vm.removeImages, 'newImages': vm.newImages, 'visibility': vm.newVisibility }, auth)
          .then(response => {
            var newPost = response.data
            newPost.postControl = [{ title: 'edit' }, { title: 'delete' }]
            vm.$store.commit('editPost', newPost) // ???
            vm.newVisibility = 'friends'
            vm.postData = null
            vm.editDialog = false
            vm.imageIDs = []
            vm.newVisibility = 'friends'
            vm.editPostID = null
            vm.removeImages = []
            vm.newImages = []
          })
          .catch(function (error) {
            if (error.response.data.status === 'expired' && count < 3) {
              count++
              vm.$store.dispatch('refreshToken')
              setTimeout(doEditPost(count), 1000)
            } else if (error.response.status >= 400 && count < 3) {
              count++
              setTimeout(doEditPost(count), 1000)
            } else {
              console.log(error)
              vm.postData = null
              vm.editDialog = false
              vm.imageIDs = []
              vm.newVisibility = 'friends'
              vm.editPostID = null
              vm.removeImages = []
              vm.newImages = []
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
            console.log(error)
          })
      }

      console.log('running onFileChange')
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
            console.log(error)
          })
      }

      console.log('running onFileChange')
      for (var i = 0; i < file.length; i++) {
        doPost(this, file[i])
      }
    },
    postDate (utcdate) {
      return moment.unix(utcdate).fromNow()
    },
    postComment (id) {
      // var thisPostID = parseInt(id)
      console.log(id)
      var elementPos = this.$store.getters.posts.findIndex(p => p.id === id)
      console.log(elementPos)
      function doPost (vm, count) {
        var auth = {
          headers: { 'Content-Type': 'application/json', 'Authorization': vm.$store.state.token }
        }

        axios.post(process.env.VUE_APP_API_SERVER + 'comments',
          { 'comment': vm.$store.getters.posts[elementPos].newComment,
            'post_id': id
          }, auth)
          .then(response => {
            console.log('did the comment post')
            vm.$store.commit('addNewComment', { comment: response.data, elementPos: elementPos })
            // vm.$store.getters.posts[elementPos].newComment = ''
            // console.log(response.data)
            // vm.$store.getters.posts[elementPos].comments.push(response.data)
          })
          .catch(function (error) {
            console.log(error)
            if (error.response.data.status === 'expired' && count < 3) {
              count++
              vm.$store.dispatch('refreshToken')
              setTimeout(doPost(count), 1000)
            } else if (error.response.status >= 400 && count < 3) {
              count++
              setTimeout(doPost(count), 1000)
            } else {
              console.log(error)
              vm.$store.commit('cleanNewComment', elementPos)
              // vm.$store.getters.posts[elementPos].newComment = ''
              // add cleanup here
            }
          })
      }
      let vm = this
      var count = 0
      doPost(vm, count)
    },
    postPost () {
      function doPost (vm, count) {
        console.log('starting doPost')
        var auth = {
          headers: { 'Content-Type': 'application/json', 'Authorization': vm.$store.state.token }
        }
        console.log(vm.imagePaths)
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
              console.log(error)
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
      console.log('starting removedEvent')
      function deleteFile (vm, count, key) {
        var auth = {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': vm.$store.getters.token }
        }
        axios
          .delete(process.env.VUE_APP_API_SERVER + 'images?fileName=' + key, auth)
          .then(response => {
            for (var i = 0; i < vm.imageIDs.length; i++) {
              if (vm.imageIDs[i].key === key) {
                console.log('removing')
                vm.imageIDs.splice(i, 1)
              }
            }
          })
          .catch(function (e) {
            console.log(e)
            if (e.response.data.status === 'expired' && count < 3) {
              count++
              vm.$store.dispatch('refreshToken')
              setTimeout(deleteFile(vm, count, image), 1000)
            } else if (e.response.status >= 400 && count < 3) {
              count++
              setTimeout(deleteFile(vm, count, image), 1000)
            } else {
              console.log(e)
            }
          })
      }
      let vm = this
      var count = 0
      deleteFile(vm, count, image.key)
    },
    removedEditEvent (image) {
      console.log('starting removedEditEvent')
      console.log(image)
      this.removeImages.push(image)
      for (var i = 0; i < this.imageIDs.length; i++) {
        if (this.imageIDs[i].key === image.key) {
          console.log('removing')
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
  },
  mounted () {
    console.log('running Mounted')
    this.scroll()
    let vm = this
    setTimeout(function () { vm.autoRefreshToken() }, 300000)
  },
  created () {
    console.log('running Created')
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  beforeCreate () {
    console.log('running beforeCreated')
    function getFeed (vm, count) {
      console.log('running getFeed')
      var auth = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': vm.$store.getters.token }
      }
      axios
        .get(process.env.VUE_APP_API_SERVER + 'feed', auth)
        .then(response => {
          var incomingPosts = response.data.posts

          for (var i = 0; i < incomingPosts.length; i++) {
            incomingPosts[i].changed = false
            incomingPosts[i].newComment = ''
            if (incomingPosts[i].email === vm.$store.state.user.email) {
              incomingPosts[i].postControl = [{ title: 'edit' }, { title: 'delete' }]
            } else {
              incomingPosts[i].postControl = []
            }
          }
          vm.$store.dispatch('loadPosts', incomingPosts)
        })
        .catch(function (error) {
          // if (error.response.data.status === 'expired' && count < 3) {
          if (error.response.status === 401 && count < 3) {
            count++
            vm.$store.dispatch('refreshToken')
            setTimeout(getFeed(vm, count), 1000)
          } else if (error.response.status >= 400 && count < 3) {
            count++
            setTimeout(getFeed(vm, count), 1000)
          } else {
            console.log(error)
            vm.dialog = false
          }
        })
    }
    let vm = this
    var count = 0
    getFeed(vm, count)
  },
  destroyed () {
    window.removeEventListener('resize', this.handleResize)
  },
  watch: {
    imgDialog (val) {
      if (!val) {
        this.imgDialogImages = []
      }
    },
    deletePostDialog (val) {
      if (!val) {
        this.deletePostID = null
      }
    }
  }
}
</script>
