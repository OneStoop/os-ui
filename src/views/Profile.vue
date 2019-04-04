<template>
  <v-container fluid>
<v-layout justify-center align-center>
  <v-flex xs10>
    <v-container grid-list-md text-xs>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card>
            <v-container grid-list-md text-xs>
              <v-layout row wrap>
                <v-flex xs4>
                  <v-card>
                    <v-toolbar flat card color='white'>
                      <v-spacer></v-spacer>
                      <v-icon>edit</v-icon>
                    </v-toolbar>
                    <v-avatar size=160>
                      <v-icon v-if="this.$store.state.profile.avatar == null" size=160>person</v-icon>
                      <img v-else :src="this.$store.state.profile.avatar">
                    </v-avatar>
                    <p class="title">{{ this.$store.state.profile.name }}</p>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
            <p>This is {{ $route.params.email }} profile page</p>
            <p>{{ this.$store.state.user }}</p>
            <p>{{ this.$store.state.profile }}</p>
            <p>{{ this.$store.state.token }}</p>
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
            </v-tabs>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex>
</v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    bottom: false,
    active: null,
    tabs: [
      { 'id': 1, 'tabName': 'Posts' },
      { 'id': 2, 'tabName': 'About' },
      { 'id': 3, 'tabName': 'Friends' },
      { 'id': 4, 'tabName': 'Followers' }
    ]
  })
}
</script>
