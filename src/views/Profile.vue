<template>
  <v-container fluid>
<v-layout justify-center align-center>
  <v-flex xs10>
    <v-container grid-list-md text-xs>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card>
            <v-container grid-list-md text-xs>
              <v-layout>
                <v-flex xs12 sm4>
                  <v-card class="text-md-center">
                      <v-avatar size=160>
                        <v-icon v-if="userProfile.avatar == null" size=160>person</v-icon>
                        <img v-else :src="userProfile.avatar">
                      </v-avatar>

                    <v-card-actions>
                      {{ userProfile.name }}
                      <v-spacer></v-spacer>
                      <v-btn flat icon v-if="$route.params.email === this.$store.getters.user.email">
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex xs12 class="text-lg-right">
                  <v-spacer></v-spacer>
                  <v-btn round small color="primary" v-if="this.userProfile.visibility === null">
                    <v-icon left>person_add</v-icon>
                    Add Friend
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
            <p>This is {{ $route.params.email }} profile page</p>
            <p>{{ userProfile }}</p>
            <v-tabs
              v-model="active"
              right
            >
              <v-tab
                v-for="tab in tabs"
                :key=tab.id
                ripple
              >
                {{ tab.tabName }}
              </v-tab>
              <v-tab-item>
                <v-layout>
                  <v-flex d-flex md3></v-flex>
                    <v-flex d-flex md6>
                      <v-layout justify-center wrap>
                        <v-flex
                          v-for="post in usersPosts"
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
                                    <v-list-tile-sub-title>
                                      {{ postDate(post.created_date) }}
                                    </v-list-tile-sub-title>
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
                        
                        <v-flex xs12 class="text-xs-center" v-observe-visibility="addTimeline">
                          <v-card>
                            <v-progress-circular
                              indeterminate
                              color="primary"
                              :size="50"
                              v-if="timelineLoading"
                            ></v-progress-circular>
                          </v-card>
                        </v-flex>
                        
                        
                      </v-layout>
                    </v-flex>
                  <v-flex d-flex md3></v-flex>
                </v-layout>
              </v-tab-item>

              <v-tab-item>item2</v-tab-item>
              <v-tab-item>Photos</v-tab-item>
              <v-tab-item>
                <v-card>
                  <v-container
                    fluid
                    grid-list-lg
                  >
                    <v-layout row wrap>
                      <v-flex 
                        v-for="friend in friends"
                        :key="friend.name"
                        xs6
                      >
                        <v-card>
                          {{ friend.name }}
                        </v-card>
                      </v-flex>

                      <v-flex xs12 class="text-xs-center" v-observe-visibility="needMoreFriends">
                        <v-card>
                            <v-progress-circular
                              indeterminate
                              color="primary"
                              :size="50"
                              v-if="friendsLoading"
                            ></v-progress-circular>
                        </v-card>
                      </v-flex>

                    </v-layout>
                  </v-container>
                </v-card>
              </v-tab-item>

              <v-tab-item>item4</v-tab-item>
            </v-tabs>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex>
</v-layout>
<v-layout>

</v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'
import mixin from '../functions/shared.js'

export default {
  mixins: [mixin],
  data: () => ({
    active: null,
    tabs: [
      { 'id': 1, 'tabName': 'Posts' },
      { 'id': 2, 'tabName': 'About' },
      { 'id': 3, 'tabName': 'Photos' },
      { 'id': 4, 'tabName': 'Friends' },
      { 'id': 5, 'tabName': 'Followers' }
    ],
    usersPosts: [],
    userProfile: {},
    friends: [],
    friendsPage: 1,
    friendsLoading: false,
    allFriendsLoaded: false,
    timelineLoading: false,
    allTimelineLoaded: false
  }),
  methods: {
    needMoreFriends (isVisible, entry) {
      if (this.allFriendsLoaded === false) {
        if (isVisible) {
          console.log('setting friendsLoading')
          this.friendsLoading = true
          this.addFriends()
        } else { this.friendsLoading = false }
      }
    },
    needMoreTimeline (isVisible, entry) {
      if (this.allTimelineLoaded === false) {
        if (isVisible) {
          console.log('setting timelineLoading')
          this.timelineLoading = true
          this.addTimeline()
        } else { this.timelineLoading = false }
      }
    },
    addTimeline () {
      var auth = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': this.$store.getters.token }
      }
      if (this.usersPosts.length > 0) {
        var endTime = this.usersPosts[this.usersPosts.length - 1].created_date
      } else { var endTime = Date.now() / 1000 | 0 }
      axios
        .get(process.env.VUE_APP_API_SERVER + 'timeline?limit=10&email=' + this.$route.params.email + '&endTime=' + endTime, auth)
        .then(response => {
          if (this.allTimelineLoaded === false) {
            var incomingPosts = response.data.posts

            for (var i = 0; i < incomingPosts.length; i++) {
              incomingPosts[i].changed = false
              incomingPosts[i].newComment = ''
              if (incomingPosts[i].email === this.$store.state.user.email) {
                incomingPosts[i].postControl = [{ title: 'edit' }, { title: 'delete' }]
              } else {
                incomingPosts[i].postControl = []
              }
              // this.usersPosts.splice(this.usersPosts.length, 0, incomingPosts[i])
              this.usersPosts.push(incomingPosts[i])
            }
            if (response.data.lastPost === false) {
              this.timelineLoading = false
            } else {
              this.allTimelineLoaded = true
              this.timelineLoading = false
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    getProfile (vm, count) {
      console.log('running getProfile')
      var auth = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': vm.$store.getters.token }
      }
      axios
        .get(process.env.VUE_APP_API_SERVER + 'users?email=' + vm.$route.params.email, auth)
        .then(response => {
          vm.userProfile =  response.data
        })
        .catch(function (error) {
          // if (error.response.data.status === 'expired' && count < 3) {
          if (error.response.status === 401 && count < 3) {
            count++
            vm.$store.dispatch('refreshToken')
            setTimeout(vm.getProfile(vm, count), 1000)
          } else if (error.response.status >= 400 && count < 3) {
            count++
            setTimeout(vm.getProfile(vm, count), 1000)
          } else {
            vm.dialog = false
          }
        })
    },
    addFriends () {
      var auth = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': this.$store.getters.token }
      }
      axios
      .get(process.env.VUE_APP_API_SERVER + 'friends?limit=10&page=' + this.friendsPage + '&email=' + this.$route.params.email, auth)
      .then(response => {
        if (this.allFriendsLoaded === false) {
          for (var i = 0; i < response.data.friends.length; i++) {
            this.friends.push(response.data.friends[i])
          }
          if (response.data.page < response.data.total_pages) {
            this.friendsPage = response.data.page + 1
          } else {
            this.allFriendsLoaded = true
            this.friendsLoading = false
          }
        }
      })
      .catch(function (error) {
        // if (error.response.data.status === 'expired' && count < 3) {
        console.log(error)
      })
    }
  },
  beforeCreate () {
    var count = 0
  },
  mounted () {
    this.needMoreFriends()
  },
  created () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()

    var count = 0
    let vm = this
    this.getProfile(vm, count)
    this.needMoreTimeline()
  },
  destroyed () {
    this.usersPosts = []
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
    },
    $route (to, from) {
      this.usersPosts = []
      this.friends = []
      this.allFriendsLoaded = false
      this.allTimelineLoaded = false
      var count = 0
      let vm = this
      this.getProfile(vm, count)
      this.addFriends()
    }
  }
}
</script>
