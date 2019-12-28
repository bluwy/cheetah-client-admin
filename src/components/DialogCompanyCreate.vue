<template>
  <v-dialog
    v-bind="$attrs"
    persistent
    width="400"
    max-width="95vw"
    v-on="$listeners"
  >
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      @submit.prevent="createCompany()"
    >
      <v-card>
        <v-card-title>Create Company</v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-text-field
              v-model="formCompany.alias"
              :rules="rule.alias"
              label="Alias"
              spellcheck="false"
            />
            <v-text-field
              v-model="formCompany.name"
              :rules="rule.name"
              label="Full Name"
              spellcheck="false"
            />
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <dialog-yes-no
            v-model="dialogClose"
            header="Are you sure?"
            message="Data you have entered are not saved"
            @yes="close(true)"
          />
          <v-btn
            outlined
            color="error"
            @click.stop="close()"
          >
            Cancel
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { isEqual } from 'lodash-es'
import { getErrorMessages } from '@/utils/apollo'
import { cacheObjKeys } from '@/utils/common'
import { required, maxStrLength } from '@/utils/inputRules'
import DialogYesNo from '@/components/DialogYesNo.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import COMPANY_CREATE from '@/graphql/CompanyCreate.graphql'
import COMPANY_GET_ALL from '@/graphql/CompanyGetAll.graphql'

const formCompanyFactory = () => ({
  alias: '',
  name: ''
})

export default {
  name: 'DialogCompanyCreate',
  components: {
    DialogYesNo
  },
  data: () => ({
    valid: false,
    formCompany: formCompanyFactory(),
    rule: {
      alias: [required, maxStrLength(4)],
      name: [required, maxStrLength(128)]
    },
    dialogClose: false
  }),
  computed: {
    isDirty () {
      return !isEqual(this.formCompany, formCompanyFactory())
    }
  },
  methods: {
    close (force) {
      if (!force && this.isDirty) {
        this.dialogClose = true
      } else {
        this.reset()
        this.$emit('input', false)
      }
    },
    reset () {
      this.formCompany = formCompanyFactory()
      this.$refs.form.resetValidation()
    },
    async createCompany () {
      if (this.$refs.form.validate() && this.isDirty) {
        const { cache, restore } = cacheObjKeys(this, ['formCompany'])

        this.close(true)

        try {
          await this.$apollo.mutate({
            mutation: COMPANY_CREATE,
            variables: cache.formCompany,
            update: (store, { data: { createCompany } }) => {
              if (createCompany != null) {
                const data = store.readQuery({ query: COMPANY_GET_ALL })

                store.writeQuery({
                  query: COMPANY_GET_ALL,
                  data: {
                    companies: data.companies.concat([createCompany])
                  }
                })
              } else {
                throw new Error('Unable to create company')
              }
            }
          })

          snackbarPush({ color: 'success', message: 'Company created' })
        } catch (e) {
          restore()
          this.$emit('input', true)

          snackbarPush({ color: 'error', message: getErrorMessages(e).join(', ') })
        }
      }
    }
  }
}
</script>

<style>
</style>
