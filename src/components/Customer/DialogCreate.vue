<template>
  <base-dialog
    ref="dialog"
    v-bind="$attrs"
    :is-dirty="isDirty"
    show-actions
    dialog-title="Add New Customer"
    v-on="$listeners"
    @close="resetForm()"
    @ok="createCustomer()"
  >
    <v-row no-gutters>
      <v-col
        cols="auto"
        style="width: 120px;"
      >
        <customer-input-code
          v-model="formCustomer.code"
          :rules="rule.code"
          label="Code"
          spellcheck="false"
        />
      </v-col>
      <v-col>
        <customer-input-name
          v-model="formCustomer.name"
          :rules="rule.name"
          label="Name"
          spellcheck="false"
        />
      </v-col>
    </v-row>
    <v-text-field
      v-model="formCustomer.phoneNumber"
      label="Phone Number (optional)"
      prepend-icon="mdi-phone"
      spellcheck="false"
    />
    <v-text-field
      v-model="formCustomer.email"
      :rules="rule.email"
      label="Email (optional)"
      prepend-icon="mdi-email"
      spellcheck="false"
    />
    <input-addresses
      :addresses="formCustomer.addresses"
      prepend-icon="mdi-map-marker"
      label="Address"
      spellcheck="false"
    />
    <v-row>
      <v-col cols="12">
        <input-company
          v-model="formCustomer.companyBelongId"
          :rules="rule.companyBelongId"
          label="Managed by"
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
          label="Technician 1"
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
          label="Technician 2 (optional)"
          hide-details
          dense
          clearable
        />
      </v-col>
    </v-row>
  </base-dialog>
</template>

<script>
import { isEqual } from 'lodash-es'
import { storeDeleteQuery } from '@/utils/apollo'
import { cacheObjKeys } from '@/utils/common'
import { required, email } from '@/utils/inputRules'
import BaseDialog from '@/components/BaseDialog.vue'
import CustomerInputCode from '@/components/Company/InputCode.vue'
import CustomerInputName from '@/components/Company/InputName.vue'
import InputAddresses from '@/components/InputAddresses.vue'
import InputCompany from '@/components/InputCompany.vue'
import InputStaff from '@/components/InputStaff'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import CUSTOMER_CREATE from '@/graphql/Customer/Create.graphql'

const formCustomerFactory = () => ({
  code: '',
  name: '',
  addresses: [],
  email: '',
  phoneNumber: '',
  companyBelongId: '',
  staffPrimaryId: '',
  staffSecondaryId: ''
})

export default {
  name: 'CustomerDialogCreate',
  components: {
    BaseDialog,
    CustomerInputCode,
    CustomerInputName,
    InputAddresses,
    InputCompany,
    InputStaff
  },
  data: () => ({
    formCustomer: formCustomerFactory(),
    rule: {
      code: [required],
      name: [required],
      email: [email],
      companyBelongId: [required],
      staffPrimaryId: [required]
    }
  }),
  computed: {
    isDirty () {
      return !isEqual(this.formCustomer, formCustomerFactory())
    }
  },
  methods: {
    resetForm () {
      this.formCustomer = formCustomerFactory()
      this.$refs.dialog.$refs.form.resetValidation()
    },
    async createCustomer () {
      const { cache, restore } = cacheObjKeys(this, ['formCustomer'])

      // This will reset form, as triggered by dialog close event
      this.$emit('input', false)

      snackbarPush({ color: 'success', message: 'Added new customer' })

      try {
        await this.$apollo.mutate({
          mutation: CUSTOMER_CREATE,
          variables: cache.formCustomer,
          update: (store, { data: { createCustomer } }) => {
            if (createCustomer != null) {
              storeDeleteQuery(store, /^customers/)
            }
          }
        })

        this.$emit('create-customer')
      } catch (e) {
        console.error(e)

        restore()

        this.$emit('input', true)

        snackbarPush({ color: 'error', message: 'Unable to add new customer' })
      }
    }
  }
}
</script>
