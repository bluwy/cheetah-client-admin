<template>
  <v-dialog
    v-bind="$attrs"
    persistent
    width="400"
    max-width="95vw"
    v-on="$listeners"
  >
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      @submit.prevent="createStaff()"
    >
      <v-card>
        <v-card-title>Create Staff</v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-text-field
              v-model="formStaff.username"
              :rules="rule.username"
              label="Username"
              spellcheck="false"
            />
            <v-text-field
              v-model="formStaff.fullName"
              :rules="rule.fullName"
              label="Full Name"
              spellcheck="false"
            />
            <input-password
              v-model="formStaff.password"
              :rules="rule.password"
              label="Password"
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
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { isEqual } from 'lodash-es'
import { getErrorMessages } from '@/utils/apollo'
import { cacheObjKeys, restoreObjKeys } from '@/utils/common'
import { required, minStrLength, maxStrLength } from '@/utils/inputRules'
import DialogYesNo from '@/components/DialogYesNo.vue'
import InputPassword from '@/components/InputPassword.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import STAFF_CREATE from '@/graphql/StaffCreate.graphql'
import STAFF_GET_ALL from '@/graphql/StaffGetAll.graphql'

const formStaffFactory = () => ({
  username: '',
  fullName: '',
  password: ''
})

export default {
  name: 'DialogStaffCreate',
  components: {
    DialogYesNo,
    InputPassword
  },
  data: () => ({
    valid: false,
    formStaff: formStaffFactory(),
    rule: {
      username: [required, maxStrLength(16)],
      fullName: [required, maxStrLength(128)],
      password: [required, minStrLength(8)]
    },
    dialogClose: false
  }),
  computed: {
    isDirty () {
      return !isEqual(this.formStaff, formStaffFactory())
    }
  },
  methods: {
    close (force) {
      if (!force && this.isDirty) {
        this.dialogClose = true
      } else {
        this.reset()
        this.$emit('input', false)
      }
    },
    reset () {
      this.formStaff = formStaffFactory()
      this.$refs.form.resetValidation()
    },
    async createStaff () {
      if (this.$refs.form.validate() && this.isDirty) {
        const cache = cacheObjKeys(this, ['formStaff'])

        this.close(true)

        try {
          await this.$apollo.mutate({
            mutation: STAFF_CREATE,
            variables: cache.formStaff,
            update: (store, { data: { createStaff } }) => {
              if (createStaff != null) {
                const data = store.readQuery({ query: STAFF_GET_ALL })

                store.writeQuery({
                  query: STAFF_GET_ALL,
                  data: {
                    staffs: data.staffs.concat([createStaff])
                  }
                })
              } else {
                throw new Error('Unable to create staff')
              }
            }
          })

          snackbarPush({ color: 'success', message: 'Staff created' })
        } catch (e) {
          restoreObjKeys(this, cache)
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
