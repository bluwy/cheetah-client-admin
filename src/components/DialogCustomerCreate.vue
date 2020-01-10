<template>
  <v-dialog
    v-bind="$attrs"
    :persistent="isDirty"
    width="700"
    max-width="95vw"
    v-on="$listeners"
  >
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      @submit.prevent="createCustomer()"
    >
      <v-card>
        <v-card-title>
          Create Customer
        </v-card-title>
        <v-container fluid>
          <v-card-title class="pt-0">
            <v-row no-gutters>
              <v-col
                cols="auto"
                style="width: 120px;"
              >
                <v-text-field
                  v-model="formCustomer.code"
                  class="font-weight-bold"
                  placeholder="Code*"
                  hide-details
                  dense
                  solo
                  flat
                />
              </v-col>
              <v-col>
                <v-text-field
                  v-model="formCustomer.name"
                  :rules="rule.name"
                  placeholder="Name*"
                  hide-details
                  dense
                  solo
                  flat
                />
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="formCustomer.phoneNumber"
              prepend-icon="mdi-phone"
              placeholder="Phone Number"
              hide-details
              dense
              solo
              flat
            />
            <v-text-field
              v-model="formCustomer.email"
              :rules="rule.email"
              prepend-icon="mdi-email"
              placeholder="Email"
              hide-details
              dense
              solo
              flat
            />
            <input-addresses
              :addresses="formCustomer.addresses"
              prepend-icon="mdi-map-marker"
            />
            <v-row>
              <v-col cols="12">
                <input-company
                  v-model="formCustomer.companyBelongId"
                  :rules="rule.companyBelongId"
                  label="Managed by*"
                  hide-details
                  dense
                  clearable
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <input-staff
                  v-model="formCustomer.staffPrimaryId"
                  :rules="rule.staffPrimaryId"
                  :staffs-filter="v => v.id !== formCustomer.staffSecondaryId"
                  label="Technician 1*"
                  hide-details
                  dense
                  clearable
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <input-staff
                  v-model="formCustomer.staffSecondaryId"
                  :staffs-filter="v => v.id !== formCustomer.staffPrimaryId"
                  label="Technician 2"
                  hide-details
                  dense
                  clearable
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-container>
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
    </v-form>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { isEqual, cloneDeep } from 'lodash-es'
import { getErrorMessages, storeDeleteQuery } from '@/utils/apollo'
import { cacheObjKeys, transformObj } from '@/utils/common'
import { required, email } from '@/utils/inputRules'
import DialogYesNo from '@/components/DialogYesNo.vue'
import InputAddresses from '@/components/InputAddresses.vue'
import InputCompany from '@/components/InputCompany.vue'
import InputStaff from '@/components/InputStaff'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import CUSTOMER_CREATE from '@/graphql/CustomerCreate.graphql'

const formCustomerFactory = () => ({
  code: '',
  name: '',
  addresses: [],
  phoneNumber: '',
  companyBelongId: '',
  email: '',
  staffPrimaryId: '',
  staffSecondaryId: ''
})

export default {
  name: 'DialogCustomerCreate',
  components: {
    DialogYesNo,
    InputAddresses,
    InputCompany,
    InputStaff
  },
  data: () => ({
    valid: false,
    formCustomer: formCustomerFactory(),
    rule: {
      code: [required],
      name: [required],
      email: [email],
      companyBelongId: [required],
      staffPrimaryId: [required]
    },
    dialogClose: false
  }),
  computed: {
    ...mapGetters([
      'isPrivilegeBasic'
    ]),
    isDirty () {
      return !isEqual(this.formCustomer, formCustomerFactory())
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
      this.formCustomer = formCustomerFactory()
      this.$refs.form.resetValidation()
    },
    parseFormToVars (form) {
      return transformObj(cloneDeep(form), [
        { from: 'staffSecondaryId', to: 'staffSecondaryWhere', value: v => ({ id: v }) }
      ])
    },
    async createCustomer () {
      if (this.$refs.form.validate() && this.isDirty) {
        const { cache, restore } = cacheObjKeys(this, ['formCustomer'])

        this.close(true)

        try {
          await this.$apollo.mutate({
            mutation: CUSTOMER_CREATE,
            variables: this.parseFormToVars(cache.formCustomer),
            update: (store, { data: { createCustomer } }) => {
              if (createCustomer != null) {
                console.log(store)
                storeDeleteQuery(store, /^customers/)
                console.log(store)
                this.$emit('create-customer')
              } else {
                throw new Error('Unable to create customer')
              }
            }
          })

          snackbarPush({ color: 'success', message: 'Customer created' })
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
