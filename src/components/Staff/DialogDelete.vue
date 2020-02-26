<template>
  <dialog-yes-no
    header="Remove staff?"
    message="You cannot undo this action"
    @no="close()"
    @yes="deleteStaff()"
  />
</template>

<script>
import { cacheObjKeys } from '@/utils/common'
import DialogYesNo from '@/components/DialogYesNo.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import STAFF_DELETE from '@/graphql/Staff/Delete.graphql'
import STAFF_GET_ALL from '@/graphql/Staff/GetAll.graphql'

export default {
  name: 'StaffDialogDelete',
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
      const { cache, restore } = cacheObjKeys(this, ['staffId'])

      this.close()

      snackbarPush({ color: 'success', message: 'Removed staff' })

      try {
        await this.$apollo.mutate({
          mutation: STAFF_DELETE,
          variables: {
            id: cache.staffId
          },
          update: (store, { data: { deleteStaff } }) => {
            if (deleteStaff) {
              const data = store.readQuery({ query: STAFF_GET_ALL })

              store.writeQuery({
                query: STAFF_GET_ALL,
                data: {
                  staffs: data.staffs.filter(v => v.id !== cache.staffId)
                }
              })
            }
          }
        })
      } catch (e) {
        console.error(e)

        restore()

        this.open(cache.staffId)

        snackbarPush({ color: 'error', message: 'Unable to remove staff' })
      }
    }
  }
}
</script>

<style>

</style>
