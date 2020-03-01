<template>
  <dialog-yes-no
    v-bind="$attrs"
    header="Remove job?"
    message="You cannot undo this action"
    v-on="$listeners"
    @yes="deleteJob"
  />
</template>

<script>
import { storeDeleteQuery } from '@/utils/apollo'
import { cacheObjKeys } from '@/utils/common'
import { snackbarPush } from '@/components/Common/SnackbarGlobal.vue'
import DialogYesNo from '@/components/Common/DialogYesNo.vue'
import JOB_DELETE from '@/graphql/Job/Delete.graphql'

export default {
  name: 'JobDialogDelete',
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
    async deleteJob () {
      const { cache, restore } = cacheObjKeys(this, ['jobId'])

      this.$emit('input', false)

      snackbarPush({ color: 'success', message: 'Removed job' })

      try {
        await this.$apollo.mutate({
          mutation: JOB_DELETE,
          variables: {
            id: cache.jobId
          },
          update: (store, { data: { deleteJob } }) => {
            if (deleteJob) {
              storeDeleteQuery(store, /^jobs/)
            }
          }
        })

        this.$emit('delete-custoer')
      } catch (e) {
        console.error(e)

        restore()

        this.open(cache.adminId)

        snackbarPush({ color: 'error', message: 'Unable to remove job' })
      }
    }
  }
}
</script>
