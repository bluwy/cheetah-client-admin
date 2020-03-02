<template>
  <base-sidebar-item
    ref="item"
    v-bind="$attrs"
    :is-dirty="isDirty"
    show-actions
    item-title="Add New Company"
    v-on="$listeners"
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
  </base-sidebar-item>
</template>

<script>
import { isEqual } from 'lodash-es'
import { required, maxStrLength } from '@/utils/inputRules'
import BaseSidebarItem from '@/components/Common/BaseSidebarItem.vue'
import CompanyInputName from '@/components/Company/InputName.vue'
import CompanyInputAlias from '@/components/Company/InputAlias.vue'
import { pushSnack } from '@/components/Common/SnackbarGlobal.vue'
import COMPANY_CREATE from '@/graphql/Company/Create.graphql'
import COMPANY_GET_ALL from '@/graphql/Company/GetAll.graphql'

const formCompanyFactory = () => ({
  name: '',
  alias: ''
})

export default {
  name: 'CompanySidebarItemCreate',
  components: {
    BaseSidebarItem,
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
      this.$refs.item.$refs.form.resetValidation()
    },
    async createCompany () {
      this.$refs.item.hide()

      pushSnack({ color: 'success', message: `Added new company "${this.formCompany.name}"` })

      try {
        await this.$apollo.mutate({
          mutation: COMPANY_CREATE,
          variables: this.formCompany,
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

        this.$refs.item.close()
      } catch (e) {
        console.error(e)

        this.$refs.item.unhide()

        pushSnack({ color: 'error', message: 'Unable to add new company' })
      }
    }
  }
}
</script>
