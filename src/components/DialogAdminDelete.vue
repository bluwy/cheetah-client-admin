<template>
  <dialog-yes-no
    v-bind="$attrs"
    header="Remove admin?"
    message="You cannot undo this action."
    v-on="$listeners"
    @no="close"
    @yes="deleteAdmin"
  />
</template>

<script>
import { getErrorMessages } from '@/utils/apollo'
import { cacheObjKeys } from '@/utils/common'
import DialogYesNo from '@/components/DialogYesNo.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import ADMIN_GET_ALL from '@/graphql/AdminGetAll.graphql'
import ADMIN_DELETE from '@/graphql/AdminDelete.graphql'

export default {
  name: 'DialogAdminDelete',
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
            } else {
              throw new Error('Unable to remove admin')
            }
          }
        })

        snackbarPush({ color: 'success', message: 'Admin removed' })
      } catch (e) {
        restore()
        this.open(cache.adminId)

        snackbarPush({ color: 'error', message: getErrorMessages(e).join(', ') })
      }
    }
  }
}
</script>

<style>

</style>
