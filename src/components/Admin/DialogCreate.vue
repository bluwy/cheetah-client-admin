<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
    @submit.prevent="createAdmin()"
  >
    <v-dialog
      v-bind="$attrs"
      :persistent="isDirty"
      width="400"
      max-width="95vw"
    >
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title>Add New Admin</v-toolbar-title>
          <v-spacer />
          <v-btn
            icon
            color="primary"
          >
            <v-icon @click="close()">
              mdi-close
            </v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-container fluid>
            <v-text-field
              v-model="formAdmin.username"
              :rules="rule.username"
              spellcheck="false"
            >
              <template>
                Username
                <tooltip-info>
                  Used to identify an admin. This cannot be changed later on.
                </tooltip-info>
              </template>
            </v-text-field>
            <input-password
              v-model="formAdmin.password"
              :rules="rule.password"
              label="Password"
              spellcheck="false"
            />
            <v-switch v-model="formAdmin.privilege">
              <template #label>
                Full access
                <tooltip-info>
                  Providing full access would give the same power as you.
                  This account can be used to delete yours too, so think twice.
                </tooltip-info>
              </template>
            </v-switch>
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
    </v-dialog>
  </v-form>
</template>

<script>
import { isEqual } from 'lodash-es'
import { cacheObjKeys } from '@/utils/common'
import { required, minStrLength, maxStrLength } from '@/utils/inputRules'
import DialogYesNo from '@/components/DialogYesNo.vue'
import InputPassword from '@/components/InputPassword.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
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
    DialogYesNo,
    InputPassword
  },
  inheritAttrs: false,
  data: () => ({
    valid: false,
    formAdmin: formAdminFactory(),
    rule: {
      username: [required, maxStrLength(16)],
      password: [required, minStrLength(8)]
    },
    dialogClose: false
  }),
  computed: {
    isDirty () {
      return !isEqual(this.formAdmin, formAdminFactory())
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
      this.formAdmin = formAdminFactory()
      this.$refs.form.resetValidation()
    },
    async createAdmin () {
      if (this.$refs.form.validate() && this.isDirty) {
        const { cache, restore } = cacheObjKeys(this, ['formAdmin'])

        const variables = {
          username: cache.formAdmin.username,
          password: cache.formAdmin.password,
          privilege: cache.formAdmin.fullAccess ? 'FULL' : 'BASIC'
        }

        this.close(true)

        snackbarPush({ color: 'success', message: `Added new admin "${cache.username}"` })

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

          snackbarPush({ color: 'error', message: 'Unable to add new admin' })
        }
      }
    }
  }
}
</script>

<style>
</style>
