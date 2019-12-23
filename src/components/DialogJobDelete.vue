<template>
  <dialog-yes-no
    :value="value"
    header="Remove job?"
    message="You cannot undo this action."
    @no="close"
    @yes="deleteJob"
  />
</template>

<script>
import { getErrorMessages, storeDeleteQuery } from '@/utils/apollo'
import DialogYesNo from '@/components/DialogYesNo.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import JOB_DELETE from '@/graphql/JobDelete.graphql'

export default {
  name: 'DialogJobDelete',
  components: {
    DialogYesNo
  },
  props: {
    value: {
      type: Boolean
    },
    jobId: {
      type: String,
      default: ''
    }
  },
  methods: {
    close () {
      this.$emit('input', false)
    },
    async deleteJob () {
      const cacheJobId = this.jobId

      this.close()

      try {
        await this.$apollo.mutate({
          mutation: JOB_DELETE,
          variables: {
            id: cacheJobId
          },
          update: (store, { data: { deleteJob } }) => {
            if (deleteJob != null) {
              storeDeleteQuery(store, /^jobs/)
              console.log(store)
              this.$emit('deleteJob')
            } else {
              throw new Error('Unable to remove job')
            }
          }
        })

        snackbarPush({ color: 'success', message: 'Job removed' })
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
