<template>
  <dialog-yes-no
    v-bind="$attrs"
    header="Remove customer?"
    message="You cannot undo this action"
    v-on="$listeners"
    @yes="deleteCustomer"
  />
</template>

<script>
import { storeDeleteQuery } from '@/utils/apollo'
import { cacheObjKeys } from '@/utils/common'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import DialogYesNo from '@/components/DialogYesNo.vue'
import CUSTOMER_DELETE from '@/graphql/Customer/Delete.graphql'

export default {
  name: 'CustomerDialogDelete',
  components: {
    DialogYesNo
  },
  data: () => ({
    customerId: ''
  }),
  methods: {
    open (customerId) {
      this.customerId = customerId
      this.$emit('input', true)
    },
    async deleteCustomer () {
      const { cache, restore } = cacheObjKeys(this, ['customerId'])

      this.$emit('input', false)

      snackbarPush({ color: 'success', message: 'Removed customer' })

      try {
        await this.$apollo.mutate({
          mutation: CUSTOMER_DELETE,
          variables: {
            id: cache.customerId
          },
          update: (store, { data: { deleteCustomer } }) => {
            if (deleteCustomer) {
              storeDeleteQuery(store, /^customers/)
            }
          }
        })

        this.$emit('delete-custoer')
      } catch (e) {
        console.error(e)

        restore()

        this.open(cache.adminId)

        snackbarPush({ color: 'error', message: 'Unable to remove customer' })
      }
    }
  }
}
</script>
