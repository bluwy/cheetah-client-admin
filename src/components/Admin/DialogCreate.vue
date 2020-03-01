<template>
  <base-dialog
    ref="dialog"
    v-bind="$attrs"
    :is-dirty="isDirty"
    show-actions
    dialog-title="Add New Admin"
    v-on="$listeners"
    @close="resetForm()"
    @ok="createAdmin()"
  >
    <admin-input-username
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
      v-model="formAdmin.privilege"
      label="Full Access"
      hint="Providing full access equals to the power you have now"
    />
  </base-dialog>
</template>

<script>
import { isEqual } from 'lodash-es'
import { cacheObjKeys } from '@/utils/common'
import { required, minStrLength, maxStrLength } from '@/utils/inputRules'
import BaseDialog from '@/components/Common/BaseDialog.vue'
import AdminInputUsername from '@/components/Admin/InputUsername.vue'
import InputPassword from '@/components/Common/InputPassword.vue'
import { pushSnack } from '@/components/Common/SnackbarGlobal.vue'
import ADMIN_CREATE from '@/graphql/Admin/Create.graphql'
import ADMIN_GET_ALL from '@/graphql/Admin/GetAll.graphql'

const formAdminFactory = () => ({
  username: '',
  password: '',
  fullAccess: false
})

export default {
  name: 'AdminDialogCreate',
  components: {
    BaseDialog,
    InputPassword,
    AdminInputUsername
  },
  data: () => ({
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
      this.$refs.dialog.$refs.form.resetValidation()
    },
    async createAdmin () {
      const { cache, restore } = cacheObjKeys(this, ['formAdmin'])

      const variables = {
        username: cache.formAdmin.username,
        password: cache.formAdmin.password,
        privilege: cache.formAdmin.fullAccess ? 'FULL' : 'BASIC'
      }

      // This will reset form, as triggered by dialog close event
      this.$emit('input', false)

      pushSnack({ color: 'success', message: `Added new admin "${cache.username}"` })

      try {
        await this.$apollo.mutate({
          mutation: ADMIN_CREATE,
          variables,
          update: (store, { data: { createAdmin } }) => {
            const data = store.readQuery({ query: ADMIN_GET_ALL })

            store.writeQuery({
              query: ADMIN_GET_ALL,
              data: {
                admins: data.admins.concat([createAdmin])
              }
            })
          }
        })
      } catch (e) {
        console.error(e)

        restore()

        this.$emit('input', true)

        pushSnack({ color: 'error', message: 'Unable to add new admin' })
      }
    }
  }
}
</script>
