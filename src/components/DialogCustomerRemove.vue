<template>
  <dialog-yes-no
    :value="value"
    header="Remove customer?"
    message="You cannot undo this action."
    @no="close"
    @yes="deleteCustomer"
  ></dialog-yes-no>
</template>

<script>
import { getErrorMessages, storeDeleteQuery } from '@/utils/apollo'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import DialogYesNo from '@/components/DialogYesNo.vue'
import CUSTOMER_DELETE from '@/graphql/CustomerDelete.graphql'

export default {
  name: 'DialogCustomerDelete',
  components: {
    DialogYesNo
  },
  props: {
    value: {
      type: Boolean
    },
    customerId: {
      type: String
    }
  },
  methods: {
    close () {
      this.$emit('input', false)
    },
    async deleteCustomer () {
      const cacheCustomerId = this.customerId

      this.close()

      try {
        await this.$apollo.mutate({
          mutation: CUSTOMER_DELETE,
          variables: {
            id: cacheCustomerId
          },
          update: (store, { data: { deleteCustomer } }) => {
            if (deleteCustomer != null) {
              storeDeleteQuery(store, /^customers/)
              console.log(store)
              this.$emit('removeCustomer')
            } else {
              throw new Error('Unable to remove customer')
            }
          }
        })

        snackbarPush({ color: 'success', message: 'Customer removed' })
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
