<template>
  <dialog-yes-no
    header="Remove admin?"
    message="This account will be deleted and logged out from all device"
    @no="close()"
    @yes="deleteAdmin()"
  />
</template>

<script>
import { cacheObjKeys } from '@/utils/common'
import DialogYesNo from '@/components/DialogYesNo.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import ADMIN_DELETE from '@/graphql/Admin/Delete.graphql'
import ADMIN_GET_ALL from '@/graphql/Admin/GetAll.graphql'

export default {
  name: 'AdminDialogDelete',
  components: {
    DialogYesNo
  },
  data: () => ({
    adminId: ''
  }),
  methods: {
    open (adminId) {
      this.adminId = adminId
      this.$emit('input', true)
    },
    close () {
      this.$emit('input', false)
    },
    async deleteAdmin () {
      const { cache, restore } = cacheObjKeys(this, ['adminId'])

      this.close()

      snackbarPush({ color: 'success', message: 'Removed admin' })

      try {
        await this.$apollo.mutate({
          mutation: ADMIN_DELETE,
          variables: {
            id: cache.adminId
          },
          update: (store, { data: { deleteAdmin } }) => {
            if (deleteAdmin) {
              const data = store.readQuery({ query: ADMIN_GET_ALL })

              store.writeQuery({
                query: ADMIN_GET_ALL,
                data: {
                  admins: data.admins.filter(v => v.id !== cache.adminId)
                }
              })
            }
          }
        })
      } catch (e) {
        console.error(e)

        restore()

        this.open(cache.adminId)

        snackbarPush({ color: 'error', message: 'Unable to remove admin' })
      }
    }
  }
}
</script>

<style>

</style>
