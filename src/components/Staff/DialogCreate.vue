<template>
  <base-dialog
    ref="dialog"
    v-bind="$attrs"
    :is-dirty="isDirty"
    show-actions
    dialog-title="Add New Company"
    v-on="$listeners"
    @close="resetForm()"
    @ok="createStaff()"
  >
    <v-text-field
      v-model="formStaff.username"
      :rules="rule.username"
      label="Username"
      spellcheck="false"
      hint="This cannot be changed again"
    />
    <v-text-field
      v-model="formStaff.fullName"
      :rules="rule.fullName"
      label="Full Name"
      spellcheck="false"
    />
    <v-alert
      outlined
      color="primary"
    >
      After creating a new staff, request the staff to <strong>login</strong>
      to the app and <strong>enter the username</strong> above. This will
      pair the staff's device to this account.
    </v-alert>
  </base-dialog>
</template>

<script>
import { isEqual } from 'lodash-es'
import { cacheObjKeys } from '@/utils/common'
import { required, minStrLength, maxStrLength } from '@/utils/inputRules'
import BaseDialog from '@/components/BaseDialog.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import STAFF_CREATE from '@/graphql/Staff/Create.graphql'
import STAFF_GET_ALL from '@/graphql/Staff/GetAll.graphql'

const formStaffFactory = () => ({
  username: '',
  fullName: '',
  password: ''
})

export default {
  name: 'StaffDialogCreate',
  components: {
    BaseDialog
  },
  inheritAttrs: false,
  data: () => ({
    formStaff: formStaffFactory(),
    rule: {
      username: [required, maxStrLength(16)],
      fullName: [required, maxStrLength(128)],
      password: [required, minStrLength(8)]
    }
  }),
  computed: {
    isDirty () {
      return !isEqual(this.formStaff, formStaffFactory())
    }
  },
  methods: {
    resetForm () {
      this.formStaff = formStaffFactory()
      this.$refs.form.resetValidation()
    },
    async createStaff () {
      const { cache, restore } = cacheObjKeys(this, ['formStaff'])

      this.close(true)

      snackbarPush({ color: 'success', message: `Added new staff "${cache.username}"` })

      try {
        await this.$apollo.mutate({
          mutation: STAFF_CREATE,
          variables: cache.formStaff,
          update: (store, { data: { createStaff } }) => {
            const data = store.readQuery({ query: STAFF_GET_ALL })

            store.writeQuery({
              query: STAFF_GET_ALL,
              data: {
                staffs: data.staffs.concat([createStaff])
              }
            })
          }
        })
      } catch (e) {
        console.error(e)

        restore()

        this.$emit('input', true)

        snackbarPush({ color: 'error', message: 'Unable to add new staff' })
      }
    }
  }
}
</script>
