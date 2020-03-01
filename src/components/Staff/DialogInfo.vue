<template>
  <base-dialog
    ref="dialog"
    v-bind="$attrs"
    :card-props="{ loading: !!loadingCount }"
    :is-editing.sync="isEditing"
    :show-actions="isEditing"
    :is-dirty="isDirty"
    :dialog-title="isEditing ? 'Update Staff' : 'Staff Info'"
    is-editable
    v-on="$listeners"
    @close="resetForm"
  >
    <v-input prepend-icon="mdi-account">
      {{ staff.username }}
    </v-input>
    <v-text-field
      v-model="newFormStaff.fullName"
      prepend-icon="mdi-shield"
      :readonly="!isEditing"
      single-line
      dense
    />
    <v-switch
      v-model="newFormStaff.active"
      :readonly="!isEditing"
      dense
    />
    <v-input :prepend-icon="staff.paired ? 'mdi-check' : 'mdi-close'">
      {{ staff.paired ? 'Paired' : 'Not paired' }}
      <staff-dialog-reset-pairing
        ref="dialogResetPairing"
        v-model="dialogResetPairing"
      />
      <v-btn
        color="primary"
        @click="$refs.dialogResetPairing.open(staffId)"
      >
        Reset Pairing
      </v-btn>
    </v-input>
    <v-input prepend-icon="mdi-cake-variant">
      {{ formatDate(staff.createdAt) }}
    </v-input>
    <v-input prepend-icon="mdi-update">
      {{ formatDate(staff.updatedAt) }}
    </v-input>
  </base-dialog>
</template>

<script>
import { isEqual } from 'lodash-es'
import { updatedDiff } from 'deep-object-diff'
import { cacheObjKeys, formatDate } from '@/utils/common'
import BaseDialog from '@/components/Common/BaseDialog.vue'
import StaffDialogResetPairing from '@/components/Staff/DialogResetPairing.vue'
import { pushSnack } from './SnackbarGlobal.vue'
import STAFF_GET_ONE from '@/graphql/Staff/GetOne.graphql'
import STAFF_UPDATE from '@/graphql/Staff/Update.graphql'

export default {
  name: 'StaffDialogInfo',
  apollo: {
    staff: {
      query: STAFF_GET_ONE,
      variables: {
        id: this.staffId
      },
      loadingKey: 'loadingCount'
    }
  },
  components: {
    BaseDialog,
    StaffDialogResetPairing
  },
  data: () => ({
    isEditing: false,
    loadingCount: 0,
    staff: {},
    staffId: '',
    formStaffFactory: () => ({}),
    newFormStaff: {},
    dialogResetPairing: false
  }),
  computed: {
    isDirty () {
      return !isEqual(this.newFormStaff, this.formStaffFactory())
    }
  },
  watch: {
    staff (val) {
      this.formStaffFactory = () => ({
        fullName: val.fullName,
        active: val.active
      })

      this.resetForm()
    }
  },
  methods: {
    formatDate,
    open (staffId) {
      this.staffId = staffId
      this.$emit('input', true)
    },
    resetForm () {
      this.newFormStaff = this.formStaffFactory()
      this.$refs.dialog.$refs.form.resetValidation()
    },
    async updateStaff () {
      const { cache, restore } = cacheObjKeys(this, ['staffId', 'formStaffFactory', 'newFormStaff'])

      const formDiff = updatedDiff(cache.formStaffFactory(), cache.newFormStaff)

      // Switch to view mode
      this.isEditing = false

      pushSnack({ color: 'success', messge: 'Updated staff' })

      try {
        await this.$apollo.mutate({
          mutation: STAFF_UPDATE,
          variables: { id: cache.staffId, ...formDiff }
        })
      } catch (e) {
        console.error(e)

        restore()

        // Re-open since user might close dialog
        this.open(cache.staffId)
        this.isEditing = true

        pushSnack({ color: 'error', message: 'Unable to update staff' })
      }
    }
  }
}
</script>
