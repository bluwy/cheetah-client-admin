<template>
  <base-sidebar-item
    ref="item"
    v-bind="$attrs"
    :is-dirty="isDirty"
    show-actions
    item-title="Add New Customer"
    v-on="$listeners"
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
        <company-autocomplete
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
        <staff-autocomplete
          v-model="formCustomer.staffPrimaryId"
          :rules="rule.staffPrimaryId"
          :filter="v => v.id !== formCustomer.staffSecondaryId"
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
        <staff-autocomplete
          v-model="formCustomer.staffSecondaryId"
          :filter="v => v.id !== formCustomer.staffPrimaryId"
          label="Technician 2 (optional)"
          hide-details
          dense
          clearable
        />
      </v-col>
    </v-row>
  </base-sidebar-item>
</template>

<script>
import { isEqual } from 'lodash-es'
import { storeDeleteQuery } from '@/utils/apollo'
import { required, email } from '@/utils/inputRules'
import BaseSidebarItem from '@/components/Common/BaseSidebarItem.vue'
import CustomerInputCode from '@/components/Customer/InputCode.vue'
import CustomerInputName from '@/components/Customer/InputName.vue'
import InputAddresses from '@/components/Common/InputAddresses.vue'
import CompanyAutocomplete from '@/components/Company/Autocomplete.vue'
import StaffAutocomplete from '@/components/Staff/Autocomplete.vue'
import { refetch } from '@/components/Customer/Table.vue'
import { pushSnack } from '@/components/Common/SnackbarGlobal.vue'
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
  name: 'CustomerSidebarItemCreate',
  components: {
    BaseSidebarItem,
    CustomerInputCode,
    CustomerInputName,
    InputAddresses,
    StaffAutocomplete,
    CompanyAutocomplete
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
      this.$refs.item.$refs.form.resetValidation()
    },
    async createCustomer () {
      this.$refs.item.hide()

      pushSnack({ color: 'success', message: 'Added new customer' })

      try {
        await this.$apollo.mutate({
          mutation: CUSTOMER_CREATE,
          variables: this.formCustomer,
          update: (store, { data: { createCustomer } }) => {
            if (createCustomer != null) {
              storeDeleteQuery(store, /^customers/)
            }
          }
        })

        this.$refs.item.close()

        refetch()
      } catch (e) {
        console.error(e)

        this.$refs.item.unhide()

        pushSnack({ color: 'error', message: 'Unable to add new customer' })
      }
    }
  }
}
</script>
