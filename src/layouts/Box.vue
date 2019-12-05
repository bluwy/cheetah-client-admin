<template>
  <v-app>
    <v-content>
      <v-row class="card-wrap" justify="center" align="center">
        <router-view></router-view>
      </v-row>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'Box'
}
</script>

<style scoped>
.card-wrap {
  height: 100%;
}
</style>
