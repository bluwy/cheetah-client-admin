<template>
  <v-dialog
    v-bind="$attrs"
    :persistent="isDirty"
    width="400"
    max-width="95vw"
    v-on="$listeners"
  >
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      @submit.prevent="resetPassword()"
    >
      <v-card>
        <v-card-title>Reset Staff Password</v-card-title>
        <v-card-text>
          <v-container fluid>
            <input-password
              v-model="password"
              :rules="passwordRule"
              label="New password*"
              spellcheck="false"
            />
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <dialog-yes-no
            v-model="dialogClose"
            header="Are you sure?"
            message="Data you have entered are not saved"
            @yes="close(true)"
          />
          <v-btn
            outlined
            color="error"
            @click.stop="close()"
          >
            Cancel
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { getErrorMessages } from '@/utils/apollo'
import { cacheObjKeys } from '@/utils/common'
import { required, minStrLength } from '@/utils/inputRules'
import DialogYesNo from '@/components/DialogYesNo.vue'
import InputPassword from '@/components/InputPassword.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import STAFF_RESET_PASSWORD from '@/graphql/StaffResetPassword.graphql'

export default {
  name: 'DialogStaffResetPassword',
  components: {
    DialogYesNo,
    InputPassword
  },
  data: () => ({
    valid: false,
    staffId: '',
    password: '',
    passwordRule: [required, minStrLength(8)],
    dialogClose: false
  }),
  computed: {
    isDirty () {
      return this.password !== ''
    }
  },
  methods: {
    open (staffId) {
      this.staffId = staffId
      this.$emit('input', true)
    },
    close (force) {
      if (!force && this.isDirty) {
        this.dialogClose = true
      } else {
        this.reset()
        this.$emit('input', false)
      }
    },
    reset () {
      this.password = ''
      this.$refs.form.resetValidation()
    },
    async resetPassword () {
      if (this.$refs.form.validate() && this.isDirty) {
        const { cache, restore } = cacheObjKeys(this, ['staffId', 'password'])

        this.close(true)

        try {
          const { data: { resetStaffPassword } } = await this.$apollo.mutate({
            mutation: STAFF_RESET_PASSWORD,
            variables: {
              id: cache.staffId,
              newPassword: cache.password
            }
          })

          if (resetStaffPassword) {
            snackbarPush({ color: 'success', message: 'Staff password resetted' })
          } else {
            throw new Error('Unable to reset staff password')
          }
        } catch (e) {
          restore()
          this.open(cache.staffId)

          snackbarPush({ color: 'error', message: getErrorMessages(e).join(', ') })
        }
      }
    }
  }
}
</script>

<style>
</style>
