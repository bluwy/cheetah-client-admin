<template>
  <v-form v-model="valid" ref="form" lazy-validation @submit.prevent="resetPassword()">
    <v-card :loading="loading" width="400">
      <v-card-title>Reset password</v-card-title>
      <v-card-subtitle>Enter your new password</v-card-subtitle>
      <v-card-text>
        <v-alert v-if="messageText" text outlined :type="messageType">
          {{ messageText }}
        </v-alert>
        <input-password
          v-model="password"
          :rules="passwordRule"
          label="New password"
          spellcheck="false"
        ></input-password>
      </v-card-text>
      <v-card-actions>
        <v-btn :disabled="loading" block color="primary" type="submit">Set new password</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { getErrorMessages } from '@/utils/apollo'
import { required, minStrLength } from '@/utils/inputRules'
import InputPassword from '@/components/InputPassword.vue'
import AUTH_ADMIN_PASSWORD_RESET from '@/graphql/AuthAdminPasswordReset.graphql'

export default {
  name: 'Reset',
  components: {
    InputPassword
  },
  data: () => ({
    valid: false,
    token: '',
    password: '',
    passwordRule: [required, minStrLength(8)],
    messageType: '',
    messageText: '',
    loading: false
  }),
  mounted () {
    const searchParams = new URLSearchParams(window.location.search)
    this.token = searchParams.get('token')

    if (!this.token) {
      this.$router.push({ path: '/login' })
    }
  },
  methods: {
    async resetPassword () {
      if (this.$refs.form.validate() && this.token && !this.loading) {
        try {
          this.loading = true

          const { data: { resetAdminPassword } } = await this.$apollo.mutate({
            mutation: AUTH_ADMIN_PASSWORD_RESET,
            variables: {
              token: this.token,
              password: this.password
            }
          })

          if (resetAdminPassword.success) {
            this.messageType = 'success'
            this.messageText = resetAdminPassword.message

            await this.$router.push({ path: '/login' })

            this.processDone = true
          } else {
            throw new Error(resetAdminPassword.message)
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
