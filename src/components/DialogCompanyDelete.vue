<template>
  <dialog-yes-no
    v-bind="$attrs"
    header="Remove company?"
    message="You cannot undo this action"
    v-on="$listeners"
    @no="close"
    @yes="deleteCompany"
  />
</template>

<script>
import { getErrorMessages } from '@/utils/apollo'
import { cacheObjKeys } from '@/utils/common'
import DialogYesNo from '@/components/DialogYesNo.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import COMPANY_GET_ALL from '@/graphql/CompanyGetAll.graphql'
import COMPANY_DELETE from '@/graphql/CompanyDelete.graphql'

export default {
  name: 'DialogCompanyDelete',
  components: {
    DialogYesNo
  },
  data: () => ({
    companyId: ''
  }),
  methods: {
    open (companyId) {
      this.companyId = companyId
      this.$emit('input', true)
    },
    close () {
      this.$emit('input', false)
    },
    async deleteCompany () {
      const { cache, restore } = cacheObjKeys(this, ['companyId'])

      this.close()

      try {
        await this.$apollo.mutate({
          mutation: COMPANY_DELETE,
          variables: {
            id: cache.companyId
          },
          update: (store, { data: { deleteCompany } }) => {
            if (deleteCompany != null) {
              const data = store.readQuery({ query: COMPANY_GET_ALL })

              store.writeQuery({
                query: COMPANY_GET_ALL,
                data: {
                  companies: data.companies.filter(v => v.id !== deleteCompany.id)
                }
              })
            } else {
              throw new Error('Unable to remove company')
            }
          }
        })

        snackbarPush({ color: 'success', message: 'Company removed' })
      } catch (e) {
        restore()
        this.open(cache.companyId)

        snackbarPush({ color: 'error', message: getErrorMessages(e).join(', ') })
      }
    }
  }
}
</script>

<style>

</style>
