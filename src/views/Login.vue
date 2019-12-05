<template>
  <v-form v-model="valid" ref="form" lazy-validation @submit.prevent="login()">
    <v-card width="400">
      <v-card-title>Login</v-card-title>
      <v-card-text>
        <v-alert v-if="messageText" text outlined :type="messageType">
          {{ messageText }}
        </v-alert>
        <v-text-field
          v-model="user.username"
          :rules="rule.username"
          label="Username"
          spellcheck="false"
        ></v-text-field>
        <input-password
          v-model="user.password"
          :rules="rule.password"
          label="Password"
          spellcheck="false"
        ></input-password>
      </v-card-text>
      <v-card-actions>
        <v-btn block color="primary" type="submit">Login</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { required } from '@/utils/inputRules'
import InputPassword from '@/components/InputPassword.vue'

const formUserFactory = () => ({
  username: '',
  password: ''
})

export default {
  name: 'Login',
  components: {
    InputPassword
  },
  data: () => ({
    valid: false,
    user: formUserFactory(),
    rule: {
      username: [required],
      password: [required]
    },
    messageType: '',
    messageText: ''
  }),
  methods: {
    login () {
      if (this.$refs.form.validate()) {
        console.log('login')
      }
    }
  }
}
</script>

<style>

</style>
