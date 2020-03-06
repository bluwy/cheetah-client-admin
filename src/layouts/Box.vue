<template>
  <v-app class="app">
    <v-content>
      <v-row
        class="card-wrap"
        justify="center"
        align="center"
      >
        <router-view class="ma-3" />
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
.app {
  background-image: url(https://picsum.photos/id/922/1000.jpg);
  background-position: center bottom;
  background-repeat: no-repeat;
  background-size: cover;
}

.card-wrap {
  height: 100%;
}
</style>
