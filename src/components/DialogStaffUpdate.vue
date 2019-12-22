<template>
  <v-dialog :value="value" persistent width="400" max-width="95vw">
    <template v-for="(_, slot) in $scopedSlots" #[slot]="scope">
      <slot :name="slot" v-bind="scope"></slot>
    </template>
    <v-form v-model="valid" ref="form" lazy-validation>
      <v-card>
        <v-card-title>Edit Staff</v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-text-field
              v-model="currentStaff.username"
              :rules="rule.username"
              label="Username"
              spellcheck="false"
            ></v-text-field>
            <v-text-field
              v-model="currentStaff.fullName"
              :rules="rule.fullName"
              label="Full Name"
              spellcheck="false"
            ></v-text-field>
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
          <v-btn color="primary" @click="updateStaff()">Edit</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { isEqual } from 'lodash-es'
import { getErrorMessages } from '@/utils/apollo'
import { required, maxStrLength } from '@/utils/inputRules'
import DialogYesNo from '@/components/DialogYesNo.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import STAFF_GET_ALL from '@/graphql/StaffGetAll.graphql'
import STAFF_GET from '@/graphql/StaffGet.graphql'
import STAFF_UPDATE from '@/graphql/StaffUpdate.graphql'

const formStaffFactory = () => ({
  username: '',
  fullName: ''
})

export default {
  name: 'DialogStaffUpdate',
  apollo: {
    staff: {
      query: STAFF_GET,
      variables () {
        return {
          id: this.staffId
        }
      },
      skip () {
        return !this.value
      }
    }
  },
  components: {
    DialogYesNo
  },
  props: {
    value: {
      type: Boolean
    },
    staffId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    valid: false,
    // Staff from server
    staff: formStaffFactory(),
    // Staff to be edited by form
    currentStaff: formStaffFactory(),
    rule: {
      username: [required, maxStrLength(16)],
      fullName: [required, maxStrLength(128)]
    },
    loading: false,
    cancelDialog: false
  }),
  computed: {
    isDirty () {
      return !isEqual(this.staff, this.currentStaff)
    }
  },
  watch: {
    staff (val) {
      // When staffId change, clone new staff to enable dirty comparison
      this.currentStaff = { ...val }
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
      this.currentStaff = { ...this.staff }
      this.$refs.form.resetValidation()
    },
    async updateStaff () {
      if (this.$refs.form.validate() && this.isDirty) {
        const cacheStaffId = this.staffId
        const cacheStaff = { ...this.currentStaff }

        this.cancel(true)

        try {
          await this.$apollo.mutate({
            mutation: STAFF_UPDATE,
            variables: {
              id: cacheStaffId,
              username: cacheStaff.username,
              fullName: cacheStaff.fullName
            },
            update: (store, { data: { updateStaff } }) => {
              if (updateStaff != null) {
                const data = store.readQuery({ query: STAFF_GET_ALL })

                if (data.staffs) {
                  const idx = data.staffs.indexOf(v => v.id === cacheStaffId)

                  if (idx !== -1) {
                    data.staffs[idx] = updateStaff

                    store.writeQuery({ query: STAFF_GET_ALL, data })
                  }
                }
              } else {
                throw new Error('Unable to update staff')
              }
            }
          })

          snackbarPush({ color: 'success', message: 'Staff updated' })
        } catch (e) {
          this.currentStaff = cacheStaff
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
