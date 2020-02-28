<template>
  <base-dialog
    ref="dialog"
    v-bind="$attrs"
    :is-dirty="isDirty"
    show-actions
    dialog-title="Add New Company"
    v-on="$listeners"
    @close="resetForm()"
    @ok="createCompany()"
  >
    <company-input-name
      v-model="formCompany.name"
      :rules="rule.name"
      label="Name"
      spellcheck="false"
    />
    <company-input-alias
      v-model="formCompany.alias"
      :rules="rule.alias"
      label="Alias"
      spellcheck="false"
      hint="Used for job code prefix"
    />
  </base-dialog>
</template>

<script>
import { isEqual } from 'lodash-es'
import { cacheObjKeys } from '@/utils/common'
import { required, maxStrLength } from '@/utils/inputRules'
import BaseDialog from '@/components/BaseDialog.vue'
import CompanyInputName from '@/components/Company/InputName.vue'
import CompanyInputAlias from '@/components/Company/InputAlias.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import COMPANY_CREATE from '@/graphql/Company/Create.graphql'
import COMPANY_GET_ALL from '@/graphql/Company/GetAll.graphql'

const formCompanyFactory = () => ({
  name: '',
  alias: ''
})

export default {
  name: 'CompanyDialogCreate',
  components: {
    BaseDialog,
    CompanyInputName,
    CompanyInputAlias
  },
  data: () => ({
    formCompany: formCompanyFactory(),
    rule: {
      name: [required, maxStrLength(16)],
      alias: [required, maxStrLength(1)]
    }
  }),
  computed: {
    isDirty () {
      return !isEqual(this.formCompany, formCompanyFactory())
    }
  },
  methods: {
    resetForm () {
      this.formCompany = formCompanyFactory()
      this.$refs.dialog.$refs.form.resetValidation()
    },
    async createCompany () {
      if (this.$refs.form.validate() && this.isDirty) {
        const { cache, restore } = cacheObjKeys(this, ['formCompany'])

        // This will reset form, as triggered by dialog close event
        this.$emit('input', false)

        snackbarPush({ color: 'success', message: `Added new company "${cache.name}"` })

        try {
          await this.$apollo.mutate({
            mutation: COMPANY_CREATE,
            variables: cache.formCompany,
            update: (store, { data: { createCompany } }) => {
              const data = store.readQuery({ query: COMPANY_GET_ALL })

              store.writeQuery({
                query: COMPANY_GET_ALL,
                data: {
                  companies: data.companies.concat([createCompany])
                }
              })
            }
          })
        } catch (e) {
          console.error(e)

          restore()

          this.$emit('input', true)

          snackbarPush({ color: 'error', message: 'Unable to add new company' })
        }
      }
    }
  }
}
</script>
