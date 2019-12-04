<template>
  <dialog-yes-no
    :value="value"
    header="Remove job?"
    message="You cannot undo this action."
    @no="close"
    @yes="remove"
  ></dialog-yes-no>
</template>

<script>
import { storeDeleteQuery } from '@/utils/apollo'
import DialogYesNo from '@/components/DialogYesNo.vue'
import JOB_REMOVE from '@/graphql/JobRemove.graphql'

export default {
  name: 'DialogJobRemove',
  components: {
    DialogYesNo
  },
  props: {
    value: {
      type: Boolean
    },
    jobId: {
      type: String
    }
  },
  methods: {
    close () {
      this.$emit('input', false)
    },
    remove () {
      const cacheJobId = this.jobId

      this.close()

      this.$apollo.mutate({
        mutation: JOB_REMOVE,
        variables: {
          id: cacheJobId
        },
        update: (store, { data: { removeJob } }) => {
          if (removeJob.success) {
            storeDeleteQuery(store, /^jobs/)
            console.log(store)
            this.$emit('remove')
          } else {
            throw new Error(removeJob.message)
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
