<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
    @submit.prevent="createStaff()"
  >
    <v-dialog
      v-bind="$attrs"
      :persistent="isDirty"
      width="400"
      max-width="95vw"
    >
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title>Add New Staff</v-toolbar-title>
          <v-spacer />
          <v-btn
            icon
            color="primary"
            @click="close()"
          >
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-container fluid>
            <v-text-field
              v-model="formStaff.username"
              :rules="rule.username"
              spellcheck="false"
            >
              <template>
                Username
                <tooltip-info>
                  Used to identify a staff. This field cannot be changed later on.
                </tooltip-info>
              </template>
            </v-text-field>
            <v-text-field
              v-model="formStaff.fullName"
              :rules="rule.fullName"
              spellcheck="false"
            >
              <template>
                Full Name
                <tooltip-info>
                  Used for searching a staff. This field can be changed anytime.
                </tooltip-info>
              </template>
            </v-text-field>
          </v-container>
          <v-alert
            outlined
            color="primary"
          >
            After creating a new staff, request the staff to <strong>login</strong>
            to the app and <strong>enter the username</strong> above. This will
            pair the staff's device to this account.
          </v-alert>
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
import TooltipInfo from '@/components/TooltipInfo.vue'
import DialogYesNo from '@/components/DialogYesNo.vue'
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
    DialogYesNo,
    TooltipInfo
  },
  inheritAttrs: false,
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
}
</script>

<style>
</style>
