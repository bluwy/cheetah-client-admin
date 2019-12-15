<template>
  <dialog-yes-no
    :value="value"
    header="Remove customer?"
    message="You cannot undo this action."
    @no="close"
    @yes="remove"
  ></dialog-yes-no>
</template>

<script>
import { getErrorMessages, storeDeleteQuery } from '@/utils/apollo'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import DialogYesNo from '@/components/DialogYesNo.vue'
import CUSTOMER_REMOVE from '@/graphql/CustomerRemove.graphql'

export default {
  name: 'DialogCustomerRemove',
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
    async remove () {
      const cacheCustomerId = this.customerId

      this.close()

      try {
        const { data: { removeCustomer } } = await this.$apollo.mutate({
          mutation: CUSTOMER_REMOVE,
          variables: {
            id: cacheCustomerId
          },
          update: (store, { data: { removeCustomer } }) => {
            if (removeCustomer.success) {
              storeDeleteQuery(store, /^customers/)
              console.log(store)
              this.$emit('remove')
            } else {
              throw new Error(removeCustomer.message)
            }
          }
        })

        snackbarPush({ color: 'success', message: removeCustomer.message })
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
