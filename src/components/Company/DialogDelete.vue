<template>
  <dialog-yes-no
    v-bind="$attrs"
    header="Remove company?"
    message="This is catastrophic!"
    v-on="$listeners"
    @yes="deleteCompany()"
  />
</template>

<script>
import { cacheObjKeys } from '@/utils/common'
import DialogYesNo from '@/components/DialogYesNo.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import COMPANY_DELETE from '@/graphql/Company/Delete.graphql'
import COMPANY_GET_ALL from '@/graphql/Company/GetAll.graphql'

export default {
  name: 'CompanyDialogDelete',
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
    async deleteCompany () {
      const { cache, restore } = cacheObjKeys(this, ['companyId'])

      this.$emit('input', false)

      snackbarPush({ color: 'success', message: 'Removed company' })

      try {
        await this.$apollo.mutate({
          mutation: COMPANY_DELETE,
          variables: {
            id: cache.companyId
          },
          update: (store, { data: { deleteCompany } }) => {
            if (deleteCompany) {
              const data = store.readQuery({ query: COMPANY_GET_ALL })

              store.writeQuery({
                query: COMPANY_GET_ALL,
                data: {
                  companies: data.companies.filter(v => v.id !== cache.companyId)
                }
              })
            }
          }
        })
      } catch (e) {
        console.error(e)

        restore()

        this.open(cache.companyId)

        snackbarPush({ color: 'error', message: 'Unable to remove company' })
      }
    }
  }
}
</script>
