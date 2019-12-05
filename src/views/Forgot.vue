<template>
  <v-form v-model="valid" ref="form" lazy-validation @submit.prevent="resetPassword()">
    <v-card width="400">
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
        <v-btn block color="primary" type="submit">Reset password</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { required } from '@/utils/inputRules'

export default {
  name: 'Login',
  data: () => ({
    valid: false,
    username: '',
    usernameRule: [required],
    messageType: '',
    messageText: ''
  }),
  methods: {
    resetPassword () {
      if (this.$refs.form.validate()) {
        console.log('reset password')
      }
    }
  }
}
</script>

<style>

</style>
