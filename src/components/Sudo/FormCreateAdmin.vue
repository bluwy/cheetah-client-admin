<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
    @submit.prevent="createAdmin()"
  >
    <v-text-field
      v-model="formAdmin.username"
      :rules="rule.username"
      label="Username"
      spellcheck="false"
      hint="This cannot be changed again"
    />
    <input-password
      v-model="formAdmin.password"
      :rules="rule.password"
      label="Password"
      spellcheck="false"
    />
    <v-switch
      v-model="formAdmin.fullAccess"
      label="Full Access"
      hint="Providing full access equals to the power you have now"
    />
    <v-btn
      type="submit"
      color="primary"
    >
      Ok
    </v-btn>
  </v-form>
</template>

<script>
import { cloneDeep, isEqual } from 'lodash-es'
import { required, minStrLength, maxStrLength } from '@/utils/inputRules'
import InputPassword from '@/components/Common/InputPassword.vue'
import SUDO_CREATE_ADMIN from '@/graphql/Sudo/CreateAdmin.graphql'

const formAdminFactory = () => ({
  username: '',
  password: '',
  fullAccess: false
})

export default {
  name: 'SudoFormCreateAdmin',
  components: {
    InputPassword
  },
  props: {
    sudoPassword: {
      type: String,
      required: true
    }
  },
  data: () => ({
    valid: true,
    formAdmin: formAdminFactory(),
    rule: {
      username: [required, maxStrLength(16)],
      password: [required, minStrLength(8)]
    }
  }),
  computed: {
    isDirty () {
      return !isEqual(this.formAdmin, formAdminFactory())
    }
  },
  methods: {
    resetForm () {
      this.formAdmin = formAdminFactory()
      this.$refs.form.resetValidation()
    },
    async createAdmin () {
      if (this.$refs.form.validate() && this.valid && this.isDirty) {
        const cacheFormAdmin = cloneDeep(this.formAdmin)

        const variables = {
          sudoPassword: this.sudoPassword,
          data: {
            username: this.formAdmin.username,
            password: this.formAdmin.password,
            privilege: this.formAdmin.fullAccess ? 'FULL' : 'BASIC'
          }
        }

        this.resetForm()

        try {
          await this.$apollo.mutate({
            mutation: SUDO_CREATE_ADMIN,
            variables
          })
        } catch (e) {
          console.error(e)

          this.formAdmin = cacheFormAdmin
        }
      }
    }
  }
}
</script>
