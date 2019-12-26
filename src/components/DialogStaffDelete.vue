<template>
  <dialog-yes-no
    v-bind="$attrs"
    header="Remove staff?"
    message="You cannot undo this action"
    v-on="$listeners"
    @no="close"
    @yes="deleteStaff"
  />
</template>

<script>
import { getErrorMessages } from '@/utils/apollo'
import { cacheObjKeys, restoreObjKeys } from '@/utils/common'
import DialogYesNo from '@/components/DialogYesNo.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import STAFF_GET_ALL from '@/graphql/StaffGetAll.graphql'
import STAFF_DELETE from '@/graphql/StaffDelete.graphql'

export default {
  name: 'DialogStaffDelete',
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
    async deleteStaff () {
      const cache = cacheObjKeys(this, ['staffId'])

      this.close()

      try {
        await this.$apollo.mutate({
          mutation: STAFF_DELETE,
          variables: {
            id: cache.staffId
          },
          update: (store, { data: { deleteStaff } }) => {
            if (deleteStaff != null) {
              const data = store.readQuery({ query: STAFF_GET_ALL })

              store.writeQuery({
                query: STAFF_GET_ALL,
                data: {
                  staffs: data.staffs.filter(v => v.id !== deleteStaff.id)
                }
              })
            } else {
              throw new Error('Unable to remove staff')
            }
          }
        })

        snackbarPush({ color: 'success', message: 'Staff removed' })
      } catch (e) {
        restoreObjKeys(this, cache)
        this.open(cache.staffId)

        snackbarPush({ color: 'error', message: getErrorMessages(e).join(', ') })
      }
    }
  }
}
</script>

<style>

</style>
