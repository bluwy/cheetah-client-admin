<template>
  <base-sidebar-item
    ref="item"
    v-bind="$attrs"
    :is-dirty="isDirty"
    show-actions
    item-title="Add New Admin"
    v-on="$listeners"
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
      v-model="formAdmin.fullAccess"
      label="Full Access"
      hint="Providing full access equals to the power you have now"
    />
  </base-sidebar-item>
</template>

<script>
import { isEqual } from 'lodash-es'
import { required, minStrLength, maxStrLength } from '@/utils/inputRules'
import BaseSidebarItem from '@/components/Common/BaseSidebarItem.vue'
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
  name: 'AdminSidebarItemCreate',
  components: {
    BaseSidebarItem,
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
      this.$refs.item.$refs.form.resetValidation()
    },
    async createAdmin () {
      const variables = {
        username: this.formAdmin.username,
        password: this.formAdmin.password,
        privilege: this.formAdmin.fullAccess ? 'FULL' : 'BASIC'
      }

      this.$refs.item.hide()

      pushSnack({ color: 'success', message: `Added new admin "${variables.username}"` })

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

        this.$refs.item.close()
      } catch (e) {
        console.error(e)

        this.$refs.item.unhide()

        pushSnack({ color: 'error', message: 'Unable to add new admin' })
      }
    }
  }
}
</script>
