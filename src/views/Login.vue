<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
    @submit.prevent="login()"
  >
    <v-card
      :loading="loading"
      width="400"
      max-width="95vw"
    >
      <v-card-title>Login</v-card-title>
      <v-card-text>
        <v-alert
          v-if="messageText"
          text
          outlined
          :type="messageType"
        >
          {{ messageText }}
        </v-alert>
        <v-text-field
          v-model="user.username"
          :rules="rule.username"
          label="Username"
          spellcheck="false"
        />
        <input-password
          v-model="user.password"
          :rules="rule.password"
          label="Password"
          spellcheck="false"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn
          :disabled="loading"
          block
          color="primary"
          type="submit"
        >
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
    <div class="text-center mt-3">
      Forgot password? Contact developer
    </div>
  </v-form>
</template>

<script>
import { getErrorMessages } from '@/utils/apollo'
import { required } from '@/utils/inputRules'
import InputPassword from '@/components/Common/InputPassword.vue'
import AUTH_LOGIN from '@/graphql/Auth/Login.graphql'

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
    async login () {
      if (this.$refs.form.validate() && !this.loading) {
        try {
          this.loading = true

          const { data: { loginAdmin } } = await this.$apollo.mutate({
            mutation: AUTH_LOGIN,
            variables: this.user
          })

          if (loginAdmin) {
            await this.$router.push({ path: '/' })
          } else {
            throw new Error('Unable to login')
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
