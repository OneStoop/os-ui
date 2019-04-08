<template>
  <v-app id="osui">
    <v-navigation-drawer
      fixed
      app
      v-model="drawer"
      v-if="this.$store.getters.isAuthenticated"
    >
      <v-list dense>
        <template v-for="item in items">
          <v-layout
            row
            v-if="item.heading"
            align-center
            :key="item.heading"
          >
            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-flex>
          </v-layout>
          <v-list-group
            v-else-if="item.children"
            v-model="item.model"
            :key="item.text"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon=""
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              v-for="(child, i) in item.children"
              :key="i"
            >
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ child.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-tile v-else :to="item.path" :key="item.text">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      color="#2196F3"
      app
      fixed
      class="white--text"
    >
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span>One Stoop</span>
      </v-toolbar-title>
      <v-autocomplete
        v-if="this.$store.getters.isAuthenticated"
        flat
        prepend-icon="search"
        placeholder="Search"
      ></v-autocomplete>
      <v-spacer></v-spacer>
      <!-- <v-btn icon v-if="$route.path != '/' && $route.path != '/signin'"> -->
      <v-btn icon v-if="this.$store.getters.isAuthenticated">
        <v-icon>chat</v-icon>
      </v-btn>
      <!-- <v-btn icon v-if="$route.path != '/' && $route.path != '/signin'"> -->
      <v-btn icon v-if="this.$store.getters.isAuthenticated">
        <v-icon>notifications</v-icon>
      </v-btn>
      <!-- <v-btn icon large v-if="$route.path != '/' && $route.path != '/signin'" :to="'/profile/' + this.$store.state.user.email"> -->
      <v-btn icon large v-if="this.$store.getters.isAuthenticated" :to="'/profile/' + this.$store.state.user.email">
        <v-avatar size="32px" tile>
          <i class="material-icons">
            account_circle
          </i>
        </v-avatar>
      </v-btn>
    </v-toolbar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      sidebar: false,
      postData: null,
      dialog: false,
      drawer: false,
      items: [
        { id: 1, icon: 'merge_type', text: 'Feed', path: '/feed' },
        { id: 2, icon: 'chat', text: 'Chatter', path: '/home' },
        {
          id: 3,
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'Groups',
          model: true,
          children: [
            { icon: 'group_add', text: 'Create Group' },
            { icon: 'group', text: 'Your Groups' }
          ]
        },
        {
          id: 4,
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'More',
          model: false,
          children: [
            { text: 'Create Page' },
            { text: 'Your Pages' }
          ]
        },
        { icon: 'settings', text: 'Settings' },
        { icon: 'chat_bubble', text: 'Send feedback' },
        { icon: 'help', text: 'Help', path: '/help' },
        { icon: 'monetization_on', text: 'Donate' },
        { icon: 'exit_to_app', text: 'Sign Out', path: '/signout' }
      ]
    }
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    },
    token () {
      return this.$store.getters.token
    },
    menuItems () {
      if (this.isAuthenticated) {
        return [
          { title: 'Home', path: this.$store.state.base_url + '/home', icon: 'home' },
          { title: 'Feed', path: this.$store.state.base_url + '/feed', icon: 'merge_type' }
        ]
      } else {
        return [
          { title: 'Sign Up', path: this.$store.state.base_url + '/signup', icon: 'face' },
          { title: 'Sign In', path: this.$store.state.base_url + '/signin', icon: 'lock_open' }
        ]
      }
    }
  },
  methods: {
    userSignOut () {
      this.$store.dispatch('userSignOut')
    }
  },
  beforeUpdate () {
    if (this.isAuthenticated) {
      this.$store.dispatch('refreshToken')
    }
  }
}
</script>
