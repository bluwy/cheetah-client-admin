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
import { storeDeleteQuery } from '@/utils/apollo'
import DialogYesNo from './DialogYesNo.vue'
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
    remove () {
      const cacheCustomerId = this.customerId

      this.close()

      this.$apollo.mutate({
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
