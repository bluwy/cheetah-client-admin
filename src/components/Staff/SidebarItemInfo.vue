<template>
  <base-sidebar-item
    ref="item"
    v-bind="$attrs"
    :card-props="{ loading: !!loadingCount }"
    :is-editing.sync="isEditing"
    :show-actions="isEditing"
    :is-dirty="isDirty"
    :item-title="isEditing ? 'Update Staff' : 'Staff Info'"
    is-editable
    v-on="$listeners"
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
      <button-confirm
        button-text="Reset Pairing"
        confirm-text="Confirm?"
        @confirm="resetStaffPairing()"
      />
    </v-input>
    <v-input prepend-icon="mdi-cake-variant">
      {{ formatDate(staff.createdAt) }}
    </v-input>
    <v-input prepend-icon="mdi-update">
      {{ formatDate(staff.updatedAt) }}
    </v-input>
  </base-sidebar-item>
</template>

<script>
import { isEqual } from 'lodash-es'
import { updatedDiff } from 'deep-object-diff'
import { formatDate } from '@/utils/common'
import BaseSidebarItem from '@/components/Common/BaseSidebarItem.vue'
import ButtonConfirm from '@/components/Common/ButtonConfirm.vue'
import { pushSnack } from '@/components/Common/SnackbarGlobal.vue'
import STAFF_GET_ONE from '@/graphql/Staff/GetOne.graphql'
import STAFF_UPDATE from '@/graphql/Staff/Update.graphql'

export default {
  name: 'StaffSidebarItemInfo',
  apollo: {
    staff: {
      query: STAFF_GET_ONE,
      variables () {
        return {
          id: this.staffId
        }
      },
      loadingKey: 'loadingCount'
    }
  },
  components: {
    BaseSidebarItem,
    ButtonConfirm
  },
  props: {
    staffId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    isEditing: false,
    loadingCount: 0,
    staff: {},
    formStaffFactory: () => ({}),
    newFormStaff: {}
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
    resetForm () {
      this.newFormStaff = this.formStaffFactory()
      this.$refs.item.$refs.form.resetValidation()
    },
    async updateStaff () {
      const formDiff = updatedDiff(this.formStaffFactory(), this.newFormStaff)

      this.isEditing = false

      pushSnack({ color: 'success', messge: 'Updated staff' })

      try {
        await this.$apollo.mutate({
          mutation: STAFF_UPDATE,
          variables: { id: this.staffId, ...formDiff }
        })
      } catch (e) {
        console.error(e)

        this.isEditing = true

        pushSnack({ color: 'error', message: 'Unable to update staff' })
      }
    }
  }
}
</script>
