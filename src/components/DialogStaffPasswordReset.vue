<template>
  <v-dialog :value="value" persistent width="400" max-width="95vw">
    <template v-for="(_, slot) in $scopedSlots" #[slot]="scope">
      <slot :name="slot" v-bind="scope"></slot>
    </template>
    <v-form v-model="valid" ref="form" lazy-validation>
      <v-card>
        <v-card-title>Reset Staff Password</v-card-title>
        <v-card-text>
          <v-container fluid>
            <input-password
              v-model="password"
              :rules="passwordRule"
              label="New password"
              spellcheck="false"
            ></input-password>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <dialog-yes-no
            v-model="dialogCancel"
            header="Are you sure?"
            message="You cannot undo this action."
            @yes="cancel(true)"
          >
            <template #activator>
              <v-btn outlined color="error" @click.stop="cancel()">Cancel</v-btn>
            </template>
          </dialog-yes-no>
          <v-btn color="primary" @click="resetPassword()">Reset</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { getErrorMessages } from '@/utils/apollo'
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
  props: {
    value: {
      type: Boolean
    },
    staffId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    valid: false,
    password: '',
    passwordRule: [required, minStrLength(8)],
    dialogCancel: false
  }),
  computed: {
    isDirty () {
      return this.password !== ''
    }
  },
  methods: {
    cancel (force) {
      if (!force && this.isDirty) {
        this.dialogCancel = true
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
        const cachePassword = this.password

        this.cancel(true)

        try {
          const { data: { resetStaffPassword } } = await this.$apollo.mutate({
            mutation: STAFF_RESET_PASSWORD,
            variables: {
              id: this.staffId,
              password: cachePassword
            }
          })

          if (resetStaffPassword) {
            snackbarPush({ color: 'success', message: 'Staff password resetted' })
          } else {
            throw new Error('Unable to reset staff password')
          }
        } catch (e) {
          this.password = cachePassword
          this.$emit('input', true)

          snackbarPush({ color: 'error', message: getErrorMessages(e).join(', ') })
        }
      }
    }
  }
}
</script>

<style>
</style>
