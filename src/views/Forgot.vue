<template>
  <v-form v-model="valid" ref="form" lazy-validation @submit.prevent="forgotPassword()">
    <v-card :loading="loading" width="400" max-width="95vw">
      <v-card-title>Forgot password</v-card-title>
      <v-card-subtitle>Enter username to reset password</v-card-subtitle>
      <v-card-text>
        <v-alert v-if="messageText" text outlined :type="messageType">
          {{ messageText }}
        </v-alert>
        <v-text-field
          v-model="username"
          :rules="usernameRule"
          label="Username"
          spellcheck="false"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn :disabled="loading" block color="primary" type="submit">Reset password</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { getErrorMessages } from '@/utils/apollo'
import { required } from '@/utils/inputRules'
import AUTH_ADMIN_PASSWORD_FORGOT from '@/graphql/AuthAdminPasswordForgot.graphql'

export default {
  name: 'Forgot',

  data: () => ({
    valid: false,
    username: '',
    usernameRule: [required],
    messageType: '',
    messageText: '',
    loading: false
  }),
  methods: {
    async forgotPassword () {
      if (this.$refs.form.validate() && !this.loading) {
        try {
          this.loading = true

          const { data: { forgotAdminPassword } } = await this.$apollo.mutate({
            mutation: AUTH_ADMIN_PASSWORD_FORGOT,
            variables: {
              username: this.username
            }
          })

          if (forgotAdminPassword.success) {
            this.messageType = 'success'
            this.messageText = forgotAdminPassword.message
            this.processDone = true
          } else {
            throw new Error(forgotAdminPassword.message)
          }
        } catch (e) {
          this.messageType = 'error'
          this.messageText = getErrorMessages(e).join(', ')
        } finally {
          this.loading = false
        }
      }
    }
  }
}
</script>

<style>

</style>
