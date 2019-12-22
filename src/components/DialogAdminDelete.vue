<template>
  <dialog-yes-no
    :value="value"
    header="Remove admin?"
    message="You cannot undo this action."
    @no="close"
    @yes="deleteAdmin"
  ></dialog-yes-no>
</template>

<script>
import { getErrorMessages } from '@/utils/apollo'
import DialogYesNo from '@/components/DialogYesNo.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import ADMIN_GET_ALL from '@/graphql/AdminGetAll.graphql'
import ADMIN_DELETE from '@/graphql/AdminDelete.graphql'

export default {
  name: 'DialogAdminDelete',
  components: {
    DialogYesNo
  },
  props: {
    value: {
      type: Boolean
    },
    adminId: {
      type: String
    }
  },
  methods: {
    close () {
      this.$emit('input', false)
    },
    async deleteAdmin () {
      const cacheAdminId = this.adminId

      this.close()

      try {
        await this.$apollo.mutate({
          mutation: ADMIN_DELETE,
          variables: {
            id: cacheAdminId
          },
          update: (store, { data: { deleteAdmin } }) => {
            if (deleteAdmin != null) {
              const data = store.readQuery({ query: ADMIN_GET_ALL })

              if (data.admins) {
                data.admins = data.admins.filter(v => v.id !== cacheAdminId)

                store.writeQuery({ query: ADMIN_GET_ALL, data })
              }
            } else {
              throw new Error('Unable to remove admin')
            }
          }
        })

        snackbarPush({ color: 'success', message: 'Admin removed' })
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
