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
      @submit.prevent="createAdmin()"
    >
      <v-card>
        <v-card-title>Create Admin</v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-text-field
              v-model="formAdmin.username"
              :rules="rule.username"
              label="Username"
              spellcheck="false"
            />
            <input-password
              v-model="formAdmin.password"
              :rules="rule.password"
              label="Password"
              spellcheck="false"
            />
            <v-radio-group
              v-model="formAdmin.privilege"
              :rules="rule.privilege"
              row
            >
              <template #label>
                <span class="mr-5">Privilege</span>
              </template>
              <v-radio
                label="Full"
                value="FULL"
              />
              <v-radio
                label="Basic"
                value="BASIC"
              />
            </v-radio-group>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <dialog-yes-no
            v-model="dialogClose"
            header="Are you sure?"
            message="You cannot undo this action."
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
    DialogYesNo,
    InputPassword
  },
  data: () => ({
    valid: false,
    formAdmin: formAdminFactory(),
    rule: {
      username: [required, maxStrLength(16)],
      password: [required, minStrLength(8)],
      privilege: [required]
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
        const cache = cacheObjKeys(this, ['formAdmin'])

        this.close(true)

        try {
          await this.$apollo.mutate({
            mutation: ADMIN_CREATE,
            variables: cache.formAdmin,
            update: (store, { data: { createAdmin } }) => {
              if (createAdmin != null) {
                const data = store.readQuery({ query: ADMIN_GET_ALL })

                store.writeQuery({
                  query: ADMIN_GET_ALL,
                  data: {
                    admins: data.admins.concat([createAdmin])
                  }
                })
              } else {
                throw new Error('Unable to create admin')
              }
            }
          })

          snackbarPush({ color: 'success', message: 'Admin created' })
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
