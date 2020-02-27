<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
    @submit.prevent="createCompany()"
  >
    <v-dialog
      v-bind="$attrs"
      :persistent="isDirty"
      width="400"
      max-width="95vw"
    >
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title>Add New Company</v-toolbar-title>
          <v-spacer />
          <v-btn
            icon
            color="primary"
            @click="close()"
          >
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-container fluid>
            <v-text-field
              v-model="formCompany.name"
              :rules="rule.name"
              spellcheck="false"
            >
              <template>
                Name
                <tooltip-info>
                  Used for searching a company name.
                </tooltip-info>
              </template>
            </v-text-field>
            <v-text-field
              v-model="formCompany.alias"
              :rules="rule.alias"
              spellcheck="false"
            >
              <template>
                Alias
                <tooltip-info>
                  Used for generating the job code.
                </tooltip-info>
              </template>
            </v-text-field>
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
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script>
import { isEqual } from 'lodash-es'
import { cacheObjKeys } from '@/utils/common'
import { required, maxStrLength } from '@/utils/inputRules'
import DialogYesNo from '@/components/DialogYesNo.vue'
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
    DialogYesNo
  },
  inheritAttrs: false,
  data: () => ({
    valid: false,
    formCompany: formCompanyFactory(),
    rule: {
      name: [required, maxStrLength(16)],
      alias: [required, maxStrLength(1)]
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

<style>
</style>
