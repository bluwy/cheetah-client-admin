<template>
  <v-dialog :value="value" persistent width="400">
    <template v-for="(_, slot) in $scopedSlots" #[slot]="scope">
      <slot :name="slot" v-bind="scope"></slot>
    </template>
    <v-form v-model="valid" ref="form" lazy-validation>
      <v-card>
        <v-card-title>Reset Staff Password</v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-text-field
              v-model="password"
              :rules="passwordRule"
              :type="passwordShow ? 'text' : 'password'"
              :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
              label="New password"
              spellcheck="false"
              @click:append="passwordShow = !passwordShow"
            ></v-text-field>
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
import { required, minStrLength } from '@/utils/inputRules'
import DialogYesNo from '@/components/DialogYesNo.vue'
import STAFF_PASSWORD_RESET from '@/graphql/StaffPasswordReset.graphql'

export default {
  name: 'DialogStaffPasswordReset',
  components: {
    DialogYesNo
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
    passwordShow: false,
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
    resetPassword () {
      if (this.$refs.form.validate() && this.isDirty) {
        const cachePassword = this.password

        this.cancel(true)

        this.$apollo.mutate({
          mutation: STAFF_PASSWORD_RESET,
          variables: {
            id: this.staffId,
            password: cachePassword
          }
        })
          .then((data) => {
            console.log(data)
            this.cancel(true)
          })
          .catch((e) => {
            console.log(e)
            this.password = cachePassword
            this.$emit('input', true)
          })
      }
    }
  }
}
</script>

<style>
</style>
