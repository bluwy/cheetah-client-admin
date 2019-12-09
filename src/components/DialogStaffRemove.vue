<template>
  <dialog-yes-no
    :value="value"
    header="Remove staff?"
    message="You cannot undo this action."
    @no="close"
    @yes="remove"
  ></dialog-yes-no>
</template>

<script>
import { getErrorMessages } from '@/utils/apollo'
import DialogYesNo from '@/components/DialogYesNo.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import STAFF_GET_ALL from '@/graphql/StaffGetAll.graphql'
import STAFF_REMOVE from '@/graphql/StaffRemove.graphql'

export default {
  name: 'DialogStaffRemove',
  components: {
    DialogYesNo
  },
  props: {
    value: {
      type: Boolean
    },
    staffId: {
      type: String
    }
  },
  methods: {
    close () {
      this.$emit('input', false)
    },
    async remove () {
      const cacheStaffId = this.staffId

      this.close()

      try {
        const { data: { removeStaff } } = await this.$apollo.mutate({
          mutation: STAFF_REMOVE,
          variables: {
            id: cacheStaffId
          },
          update: (store, { data: { removeStaff } }) => {
            if (removeStaff.success) {
              const data = store.readQuery({ query: STAFF_GET_ALL })

              if (data.staffs) {
                data.staffs = data.staffs.filter(v => v.id !== cacheStaffId)

                store.writeQuery({ query: STAFF_GET_ALL, data })
              }
            } else {
              throw new Error(removeStaff.message)
            }
          }
        })

        snackbarPush({ color: 'success', message: removeStaff.message })
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
