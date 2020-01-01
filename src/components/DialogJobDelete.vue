<template>
  <dialog-yes-no
    v-bind="$attrs"
    header="Remove job?"
    message="You cannot undo this action."
    v-on="$listeners"
    @no="close"
    @yes="deleteJob"
  />
</template>

<script>
import { getErrorMessages, storeDeleteQuery } from '@/utils/apollo'
import { cacheObjKeys } from '@/utils/common'
import DialogYesNo from '@/components/DialogYesNo.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import JOB_DELETE from '@/graphql/JobDelete.graphql'

export default {
  name: 'DialogJobDelete',
  components: {
    DialogYesNo
  },
  data: () => ({
    jobId: ''
  }),
  methods: {
    open (jobId) {
      this.jobId = jobId
      this.$emit('input', true)
    },
    close () {
      this.$emit('input', false)
    },
    async deleteJob () {
      const { cache, restore } = cacheObjKeys(this, ['jobId'])

      this.close()

      try {
        await this.$apollo.mutate({
          mutation: JOB_DELETE,
          variables: {
            id: cache.jobId
          },
          update: (store, { data: { deleteJob } }) => {
            if (deleteJob) {
              storeDeleteQuery(store, /^jobs/)
              console.log(store)
              this.$emit('delete-job')
            } else {
              throw new Error('Unable to remove job')
            }
          }
        })

        snackbarPush({ color: 'success', message: 'Job removed' })
      } catch (e) {
        restore()
        this.$emit('input', true)

        snackbarPush({ color: 'error', message: getErrorMessages(e).join(', ') })
      }
    }
  }
}
</script>

<style>

</style>
