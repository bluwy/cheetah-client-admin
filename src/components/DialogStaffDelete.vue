<template>
  <dialog-yes-no
    :value="value"
    header="Remove staff?"
    message="You cannot undo this action."
    @no="close"
    @yes="deleteStaff"
  />
</template>

<script>
import { getErrorMessages } from '@/utils/apollo'
import DialogYesNo from '@/components/DialogYesNo.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import STAFF_GET_ALL from '@/graphql/StaffGetAll.graphql'
import STAFF_DELETE from '@/graphql/StaffDelete.graphql'

export default {
  name: 'DialogStaffDelete',
  components: {
    DialogYesNo
  },
  props: {
    value: {
      type: Boolean
    },
    staffId: {
      type: String,
      default: ''
    }
  },
  methods: {
    close () {
      this.$emit('input', false)
    },
    async deleteStaff () {
      const cacheStaffId = this.staffId

      this.close()

      try {
        await this.$apollo.mutate({
          mutation: STAFF_DELETE,
          variables: {
            id: cacheStaffId
          },
          update: (store, { data: { deleteStaff } }) => {
            if (deleteStaff != null) {
              const data = store.readQuery({ query: STAFF_GET_ALL })

              if (data.staffs) {
                data.staffs = data.staffs.filter(v => v.id !== cacheStaffId)

                store.writeQuery({ query: STAFF_GET_ALL, data })
              }
            } else {
              throw new Error('Unable to remove staff')
            }
          }
        })

        snackbarPush({ color: 'success', message: 'Staff removed' })
      } catch (e) {
        this.$emit('input', true)

        snackbarPush({ color: 'error', message: getErrorMessages(e).join(', ') })
      }
    }
  }
}
</script>

<style>

</style>
