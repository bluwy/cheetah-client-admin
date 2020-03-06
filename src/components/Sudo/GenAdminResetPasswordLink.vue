<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
    @submit.prevent="genAdminResetPasswordLink()"
  >
    <v-row>
      <v-col>
        <v-text-field
          v-model="username"
          :rules="usernameRule"
          label="Enter username"
          dense
          hide-details
        />
      </v-col>
      <v-col cols="auto">
        <v-btn
          type="submit"
          color="primary"
        >
          Generate Link
        </v-btn>
      </v-col>
    </v-row>
    <v-alert
      v-if="genLink"
      color="primary"
      outlined
    >
      {{ genLink }}
    </v-alert>
  </v-form>
</template>

<script>
import { required } from '@/utils/inputRules'
import SUDO_GEN_ADMIN_RESET_PASSWORD_LINK from '@/graphql/Sudo/GenAdminResetPasswordLink.graphql'

export default {
  name: 'SudoGenResetPasswordLink',
  props: {
    sudoPassword: {
      type: String,
      required: true
    }
  },
  data: () => ({
    valid: true,
    username: '',
    usernameRule: [required],
    genLink: ''
  }),
  methods: {
    resetForm () {
      this.username = ''
      this.$refs.form.resetValidation()
    },
    async genAdminResetPasswordLink () {
      if (this.$refs.form.validate() && this.valid) {
        const cacheUsername = this.username

        const variables = {
          sudoPassword: this.sudoPassword,
          username: this.username
        }

        this.resetForm()

        try {
          const { data: { sudoGenAdminResetPasswordLink: newLink } } = await this.$apollo.mutate({
            mutation: SUDO_GEN_ADMIN_RESET_PASSWORD_LINK,
            variables
          })

          this.genLink = newLink
        } catch (e) {
          console.error(e)

          this.username = cacheUsername
        }
      }
    }
  }
}
</script>
