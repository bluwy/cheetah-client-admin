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
import { getErrorMessages, storeDeleteQuery } from '@/utils/apollo'
import DialogYesNo from '@/components/DialogYesNo.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
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
    async remove () {
      const cacheJobId = this.jobId

      this.close()

      try {
        const { data: { removeJob } } = await this.$apollo.mutate({
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

        snackbarPush({ color: 'success', message: removeJob.message })
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
