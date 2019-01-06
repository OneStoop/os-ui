<template>
  <div>Hi</div>
</template>
<script>
export default {
  beforeMount () {
    this.$store.dispatch('userSignOut')
  }
}
</script>
