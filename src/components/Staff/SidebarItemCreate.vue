<template>
  <base-sidebar-item
    ref="item"
    v-bind="$attrs"
    :is-dirty="isDirty"
    show-actions
    item-title="Add New Staff"
    v-on="$listeners"
    @ok="createStaff()"
  >
    <staff-input-username
      v-model="formStaff.username"
      :rules="rule.username"
      label="Username"
      spellcheck="false"
      hint="This cannot be changed again"
    />
    <staff-input-full-name
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
  </base-sidebar-item>
</template>

<script>
import { isEqual } from 'lodash-es'
import { required, minStrLength, maxStrLength } from '@/utils/inputRules'
import BaseSidebarItem from '@/components/Common/BaseSidebarItem.vue'
import StaffInputUsername from '@/components/Staff/InputUsername.vue'
import StaffInputFullName from '@/components/Staff/InputFullName.vue'
import { pushSnack } from '@/components/Common/SnackbarGlobal.vue'
import STAFF_CREATE from '@/graphql/Staff/Create.graphql'
import STAFF_GET_ALL from '@/graphql/Staff/GetAll.graphql'

const formStaffFactory = () => ({
  username: '',
  fullName: '',
  password: ''
})

export default {
  name: 'StaffSidebarItemCreate',
  components: {
    BaseSidebarItem,
    StaffInputUsername,
    StaffInputFullName
  },
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
      this.$refs.item.$refs.form.resetValidation()
    },
    async createStaff () {
      this.$refs.item.hide()

      pushSnack({ color: 'success', message: `Added new staff "${this.formStaff.username}"` })

      try {
        await this.$apollo.mutate({
          mutation: STAFF_CREATE,
          variables: this.formStaff,
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

        this.$refs.item.close()
      } catch (e) {
        console.error(e)

        this.$refs.item.unhide()

        pushSnack({ color: 'error', message: 'Unable to add new staff' })
      }
    }
  }
}
</script>
