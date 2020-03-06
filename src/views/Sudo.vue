<template>
  <v-card
    :class="{ 'text-center': !show }"
    width="400"
    max-width="95vw"
  >
    <template v-if="!show">
      <v-card-title class="card__title">
        <div
          contenteditable
          @input="text = $event.target.innerText"
        >
          {{ text }}
        </div>
      </v-card-title>
      <v-card-text>
        Oops... This page does not exist.
      </v-card-text>
    </template>
    <template v-else>
      <v-card-text>
        <v-text-field
          v-model="sudoPassword"
          type="password"
          label="Sudo Password"
          outlined
          hide-details
        />
      </v-card-text>
      <v-divider />
      <v-card-text>
        <div class="title">
          Create Admin
        </div>
        <sudo-create-admin :sudo-password="sudoPassword" />
      </v-card-text>
      <v-divider />
      <v-card-text>
        <div class="title">
          Reset Admin Password
        </div>
        <sudo-gen-admin-reset-password-link :sudo-password="sudoPassword" />
      </v-card-text>
    </template>
  </v-card>
</template>

<script>
import SudoCreateAdmin from '@/components/Sudo/FormCreateAdmin.vue'
import SudoGenAdminResetPasswordLink from '@/components/Sudo/GenAdminResetPasswordLink.vue'

export default {
  name: 'Sudo',
  components: {
    SudoCreateAdmin,
    SudoGenAdminResetPasswordLink
  },
  data: () => ({
    text: '404',
    sudoPassword: ''
  }),
  computed: {
    show () {
      return this.text === '810'
    }
  }
}
</script>

<style scoped>
.card__title {
  font-size: 8rem;
  line-height: 100%;
  justify-content: center;
}
</style>
