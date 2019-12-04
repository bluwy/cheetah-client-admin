<template>
  <v-dialog :value="value" persistent width="400">
    <template v-for="(_, slot) in $scopedSlots" #[slot]="scope">
      <slot :name="slot" v-bind="scope"></slot>
    </template>
    <v-form v-model="valid" ref="form" lazy-validation>
    <v-card>
      <v-card-title>Create Staff</v-card-title>
      <v-card-text>
        <v-container fluid>
          <v-text-field
            v-model="staff.username"
            :rules="rule.username"
            label="Username"
            spellcheck="false"
          ></v-text-field>
          <v-text-field
            v-model="staff.fullName"
            :rules="rule.fullName"
            label="Full Name"
            spellcheck="false"
          ></v-text-field>
          <input-password
            v-model="staff.password"
            :rules="rule.password"
            label="Password"
            spellcheck="false"
          ></input-password>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <dialog-yes-no
          v-model="cancelDialog"
          header="Are you sure?"
          message="You cannot undo this action."
          @yes="cancel(true)"
        >
          <template #activator>
            <v-btn outlined color="error" @click.stop="cancel()">Cancel</v-btn>
          </template>
        </dialog-yes-no>
        <v-btn color="primary" @click="create()">Create</v-btn>
      </v-card-actions>
    </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { required, minStrLength, maxStrLength } from '@/utils/inputRules'
import DialogYesNo from '@/components/DialogYesNo.vue'
import InputPassword from '@/components/InputPassword.vue'
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
  props: {
    value: {
      type: Boolean
    }
  },
  data: () => ({
    valid: false,
    staff: formStaffFactory(),
    rule: {
      username: [required, maxStrLength(16)],
      fullName: [required, maxStrLength(128)],
      password: [required, minStrLength(8)]
    },
    cancelDialog: false
  }),
  computed: {
    isDirty () {
      const s = this.staff
      return !!(s.username || s.fullName || s.password)
    }
  },
  methods: {
    cancel (force) {
      if (!force && this.isDirty) {
        this.cancelDialog = true
      } else {
        this.reset()
        this.$emit('input', false)
      }
    },
    reset () {
      this.$refs.form.reset()
      this.staff = formStaffFactory()
    },
    create () {
      if (this.$refs.form.validate()) {
        const cacheStaff = { ...this.staff }

        this.cancel(true)

        this.$apollo.mutate({
          mutation: STAFF_CREATE,
          variables: cacheStaff,
          update: (store, { data: { createStaff } }) => {
            if (createStaff.success) {
              const data = store.readQuery({ query: STAFF_GET_ALL })

              if (data.staffs) {
                data.staffs.push(createStaff.staff)

                store.writeQuery({ query: STAFF_GET_ALL, data })
              }
            } else {
              throw new Error(createStaff.message)
            }
          }
        })
          .then((data) => {
            console.log(data)
          })
          .catch((e) => {
            console.log(e)
            this.staff = cacheStaff
            this.$emit('input', true)
          })
      }
    }
  }
}
</script>

<style>
</style>
