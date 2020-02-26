<template>
  <dialog-yes-no
    header="Reset staff device pairing?"
    message="If this staff has a new phone, reset this pairing to allow the staff to pair to this account. The previous pairing will be logged out."
    @no="close()"
    @yes="resetStaffDeviceId()"
  />
</template>

<script>
import { cacheObjKeys } from '@/utils/common'
import DialogYesNo from '@/components/DialogYesNo.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import STAFF_RESET_DEVICE from '@/graphql/Staff/ResetDevice.graphql'

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
    close () {
      this.$emit('input', false)
    },
    async resetStaffDeviceId () {
      const { cache, restore } = cacheObjKeys(this, ['staffId'])

      this.close()

      snackbarPush({ color: 'success', message: 'Resetted staff device' })

      try {
        await this.$apollo.mutate({
          mutation: STAFF_RESET_DEVICE,
          variables: {
            id: cache.staffId
          }
        })
      } catch (e) {
        console.error(e)

        restore()

        this.open(cache.staffId)

        snackbarPush({ color: 'error', message: 'Unable to reset staff device' })
      }
    }
  }
}
</script>

<style>

</style>
