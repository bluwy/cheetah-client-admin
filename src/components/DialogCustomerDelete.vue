<template>
  <dialog-yes-no
    v-bind="$attrs"
    header="Remove customer?"
    message="You cannot undo this action."
    v-on="$listeners"
    @no="close"
    @yes="deleteCustomer"
  />
</template>

<script>
import { getErrorMessages, storeDeleteQuery } from '@/utils/apollo'
import { cacheObjKeys } from '@/utils/common'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import DialogYesNo from '@/components/DialogYesNo.vue'
import CUSTOMER_DELETE from '@/graphql/CustomerDelete.graphql'

export default {
  name: 'DialogCustomerDelete',
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
    close () {
      this.$emit('input', false)
    },
    async deleteCustomer () {
      const { cache, restore } = cacheObjKeys(this, ['customerId'])

      this.close()

      try {
        await this.$apollo.mutate({
          mutation: CUSTOMER_DELETE,
          variables: {
            id: cache.customerId
          },
          update: (store, { data: { deleteCustomer } }) => {
            if (deleteCustomer) {
              console.log(store)
              storeDeleteQuery(store, /^customers/)
              console.log(store)
              this.$emit('delete-customer')
            } else {
              throw new Error('Unable to remove customer')
            }
          }
        })

        snackbarPush({ color: 'success', message: 'Customer removed' })
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
