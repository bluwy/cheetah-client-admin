<template>
  <dialog-yes-no
    :value="value"
    header="Remove admin?"
    message="You cannot undo this action."
    @no="close"
    @yes="remove"
  ></dialog-yes-no>
</template>

<script>
import DialogYesNo from './DialogYesNo.vue'
import ADMIN_GET_ALL from '@/graphql/AdminGetAll.graphql'
import ADMIN_REMOVE from '@/graphql/AdminRemove.graphql'

export default {
  name: 'DialogAdminRemove',
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
    remove () {
      const cacheAdminId = this.adminId

      this.close()

      this.$apollo.mutate({
        mutation: ADMIN_REMOVE,
        variables: {
          id: cacheAdminId
        },
        update: (store, { data: { removeAdmin } }) => {
          if (removeAdmin.success) {
            const data = store.readQuery({ query: ADMIN_GET_ALL })

            if (data.admins) {
              data.admins = data.admins.filter(v => v.id !== cacheAdminId)

              store.writeQuery({ query: ADMIN_GET_ALL, data })
            }
          } else {
            throw new Error(removeAdmin.message)
          }
        }
      })
        .then((data) => {
          console.log(data)
        })
        .catch((e) => {
          console.log(e)
          this.$emit('input', true)
        })
    }
  }
}
</script>

<style>

</style>
