<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>You have found One Stoop!</h1>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 mt-3>
        <blockquote class="blockquote text-xs-center">
          One Stoop is a social network with a mission to be <br>
          open, honest, and not profit from your data. <br>
          Our Privacy Policy is simple.  We will never sell your data.<br>
          Our plan is to be a nonprofit company that runs on donations.<br>
          For now we are in the development phase.
        </blockquote>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  mounted () {
    console.log('Landing Page')
  }
}
</script>
