<template>
  <dialog-yes-no
    v-bind="$attrs"
    header="Reset staff pairing?"
    message="If this staff has a new phone, reset this pairing to allow the staff to re-pair to this account. The previous pairing will be logged out."
    v-on="$listeners"
    @yes="resetStaffDeviceId()"
  />
</template>

<script>
import { cacheObjKeys } from '@/utils/common'
import DialogYesNo from '@/components/Common/DialogYesNo.vue'
import { pushSnack } from '@/components/Common/SnackbarGlobal.vue'
import STAFF_RESET_PAIRING from '@/graphql/Staff/ResetPairing.graphql'

export default {
  name: 'StaffDialogResetDevice',
  components: {
    DialogYesNo
  },
  data: () => ({
    staffId: ''
  }),
  methods: {
    open (staffId) {
      this.staffId = staffId
      this.$emit('input', true)
    },
    async resetStaffDeviceId () {
      const { cache, restore } = cacheObjKeys(this, ['staffId'])

      this.$emit('input', false)

      pushSnack({ color: 'success', message: 'Resetted staff pairing' })

      try {
        await this.$apollo.mutate({
          mutation: STAFF_RESET_PAIRING,
          variables: {
            id: cache.staffId
          }
        })
      } catch (e) {
        console.error(e)

        restore()

        this.open(cache.staffId)

        pushSnack({ color: 'error', message: 'Unable to reset staff pairing' })
      }
    }
  }
}
</script>
