<template>
  <v-dialog :value="value" persistent width="400">
    <template v-for="(_, slot) in $scopedSlots" #[slot]="scope">
      <slot :name="slot" v-bind="scope"></slot>
    </template>
    <v-form v-model="valid" ref="form" lazy-validation>
      <v-card>
        <v-card-title>Create Admin</v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-text-field
              v-model="admin.username"
              :rules="rule.username"
              label="Username"
              spellcheck="false"
            ></v-text-field>
            <v-text-field
              v-model="admin.password"
              :rules="rule.password"
              :type="passwordShow ? 'text' : 'password'"
              :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
              label="Password"
              spellcheck="false"
              @click:append="passwordShow = !passwordShow"
            ></v-text-field>
            <v-radio-group
              v-model="admin.privilege"
              :rules="rule.privilege"
              row
            >
              <template #label>
                <span class="mr-5">Privilege</span>
              </template>
              <v-radio label="Full" value="FULL"></v-radio>
              <v-radio label="Basic" value="BASIC"></v-radio>
            </v-radio-group>
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
import ADMIN_CREATE from '@/graphql/AdminCreate.graphql'
import ADMIN_GET_ALL from '@/graphql/AdminGetAll.graphql'

const formAdminFactory = () => ({
  username: '',
  password: '',
  privilege: ''
})

export default {
  name: 'DialogAdminCreate',
  components: {
    DialogYesNo
  },
  props: {
    value: {
      type: Boolean
    }
  },
  data: () => ({
    valid: false,
    admin: formAdminFactory(),
    rule: {
      username: [required, maxStrLength(16)],
      password: [required, minStrLength(8)],
      privilege: [required]
    },
    passwordShow: false,
    cancelDialog: false
  }),
  computed: {
    isDirty () {
      const a = this.admin
      return !!(a.username || a.password || a.privilege)
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
      this.admin = formAdminFactory()
    },
    create () {
      if (this.$refs.form.validate()) {
        const cacheAdmin = { ...this.admin }

        this.cancel(true)

        this.$apollo.mutate({
          mutation: ADMIN_CREATE,
          variables: cacheAdmin,
          update: (store, { data: { createAdmin } }) => {
            if (createAdmin.success) {
              const data = store.readQuery({ query: ADMIN_GET_ALL })

              if (data.admins) {
                data.admins.push(createAdmin.admin)

                store.writeQuery({ query: ADMIN_GET_ALL, data })
              }
            } else {
              throw new Error(createAdmin.message)
            }
          }
        })
          .then((data) => {
            console.log(data)
          })
          .catch((e) => {
            console.log(e)
            this.admin = cacheAdmin
            this.$emit('input', true)
          })
      }
    }
  }
}
</script>

<style>

</style>
