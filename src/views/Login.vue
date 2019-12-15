<template>
  <v-form v-model="valid" ref="form" lazy-validation @submit.prevent="handleLogin()">
    <v-card :loading="loading" width="400" max-width="95vw">
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
        <v-btn :disabled="loading" block color="primary" type="submit">Login</v-btn>
      </v-card-actions>
    </v-card>
    <div class="text-center mt-3">
      <router-link to="/forgot">Forgot password</router-link>
    </div>
  </v-form>
</template>

<script>
import { mapActions } from 'vuex'
import { getErrorMessages } from '@/utils/apollo'
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
    messageText: '',
    loading: false
  }),
  methods: {
    ...mapActions([
      'login'
    ]),
    async handleLogin () {
      if (this.$refs.form.validate() && !this.loading) {
        try {
          this.loading = true

          if (await this.login(this.user)) {
            await this.$router.push({ path: '/' })
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
