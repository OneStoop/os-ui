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
import mixin from '../functions/shared.js'

export default {
  mixins: [mixin],
  components: {
  },
  computed: {
  },
  data: () => ({
  }),
  methods: {
    addPosts () {
      let vm = this
      var auth = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': vm.$store.state.token }
      }
      var endTime = this.$store.getters.posts[this.$store.getters.posts.length - 1].created_date
      axios.get(process.env.VUE_APP_API_SERVER + 'feed?endTime=' + endTime, auth)
        .then(response => {
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
        })
    }
  },
  mounted () {
    this.scroll()
    let vm = this
    setTimeout(function () { vm.autoRefreshToken() }, 300000)
  },
  created () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  beforeCreate () {
    function getFeed (vm, count) {
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
