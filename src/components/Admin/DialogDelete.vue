<template>
  <dialog-yes-no
    v-bind="$attrs"
    header="Remove admin?"
    message="This account will be deleted and logged out from all device"
    v-on="$listeners"
    @yes="deleteAdmin()"
  />
</template>

<script>
import { cacheObjKeys } from '@/utils/common'
import DialogYesNo from '@/components/Common/DialogYesNo.vue'
import { snackbarPush } from '@/components/Common/SnackbarGlobal.vue'
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
    async deleteAdmin () {
      const { cache, restore } = cacheObjKeys(this, ['adminId'])

      this.$emit('input', false)

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
