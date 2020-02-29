<template>
  <base-dialog
    ref="dialog"
    v-bind="$attrs"
    :card-props="{ loading: !!loadingCount }"
    :is-editing.sync="isEditing"
    :show-actions="isEditing"
    :is-dirty="isDirty"
    is-editable
    dialog-title="Customer Info"
    v-on="$listeners"
    @close="resetForm"
  >
    <v-row no-gutters>
      <v-col
        cols="auto"
        style="width: 120px;"
      >
        <customer-input-code
          v-model="newFormCustomer.code"
          :rules="rule.code"
          :readonly="!isEditing"
          label="Code"
          spellcheck="false"
        />
      </v-col>
      <v-col>
        <customer-input-name
          v-model="newFormCustomer.name"
          :rules="rule.name"
          :readonly="!isEditing"
          label="Name"
          spellcheck="false"
        />
      </v-col>
    </v-row>
    <v-text-field
      v-model="newFormCustomer.phoneNumber"
      :readonly="!isEditing"
      label="Phone Number (optional)"
      prepend-icon="mdi-phone"
      spellcheck="false"
    />
    <v-text-field
      v-model="newFormCustomer.email"
      :rules="rule.email"
      :readonly="!isEditing"
      label="Email (optional)"
      prepend-icon="mdi-email"
      spellcheck="false"
    />
    <input-addresses
      :addresses="newFormCustomer.addresses"
      :readonly="!isEditing"
      prepend-icon="mdi-map-marker"
      label="Address"
      spellcheck="false"
    />
    <v-row>
      <v-col cols="12">
        <company-autocomplete
          v-model="newFormCustomer.companyBelongId"
          :rules="rule.companyBelongId"
          :readonly="!isEditing"
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
          v-model="newFormCustomer.staffPrimaryId"
          :rules="rule.staffPrimaryId"
          :readonly="!isEditing"
          :filter="v => v.id !== newFormCustomer.staffSecondaryId"
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
          v-model="newFormCustomer.staffSecondaryId"
          :readonly="!isEditing"
          :filter="v => v.id !== newFormCustomer.staffPrimaryId"
          label="Technician 2 (optional)"
          hide-details
          dense
          clearable
        />
      </v-col>
    </v-row>
    <v-input prepend-icon="mdi-cake-variant">
      {{ formatDate(customer.createdAt) }}
    </v-input>
    <v-input prepend-icon="mdi-update">
      {{ formatDate(customer.updatedAt) }}
    </v-input>
  </base-dialog>
</template>

<script>
import { isEqual, cloneDeep } from 'lodash-es'
import { updatedDiff } from 'deep-object-diff'
import { cacheObjKeys, formatDate } from '@/utils/common'
import { required, email } from '@/utils/inputRules'
import BaseDialog from '@/components/BaseDialog.vue'
import CustomerInputCode from '@/components/Company/InputCode.vue'
import CustomerInputName from '@/components/Company/InputName.vue'
import CompanyAutocomplete from '@/components/Company/Autocomplete.vue'
import StaffAutocomplete from '@/components/Staff/Autocomplete.vue'
import { snackbarPush } from './SnackbarGlobal.vue'
import CUSTOMER_GET_ONE from '@/graphql/Customer/GetOne.graphql'
import CUSTOMER_UPDATE from '@/graphql/Customer/Update.graphql'

export default {
  name: 'CustomerDialogInfo',
  apollo: {
    customer: {
      query: CUSTOMER_GET_ONE,
      variables: {
        id: this.customerId
      },
      loadingKey: 'loadingCount'
    }
  },
  components: {
    BaseDialog,
    CustomerInputCode,
    CustomerInputName,
    CompanyAutocomplete,
    StaffAutocomplete
  },
  data: () => ({
    isEditing: false,
    loadingCount: 0,
    customer: {},
    customerId: '',
    formCustomerFactory: () => ({}),
    newFormCustomer: {},
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
      return !isEqual(this.newFormCustomer, this.formCustomerFactory())
    }
  },
  watch: {
    customer (val) {
      this.formCustomerFactory = () => ({
        code: val.code,
        name: val.name,
        addresses: cloneDeep(val.addresses),
        email: val.email,
        phoneNumber: val.phoneNumber,
        companyBelongId: val.companyBelong.id,
        staffPrimaryId: val.staffPrimary.id,
        staffSecondaryId: (val.staffSecondary && val.staffSecondary.id) || ''
      })

      this.resetForm()
    }
  },
  methods: {
    formatDate,
    open (customerId) {
      this.customerId = customerId
      this.$emit('input', true)
    },
    resetForm () {
      this.newFormCustomer = this.formCustomerFactory()
      this.$refs.dialog.$refs.form.resetValidation()
    },
    formDiff (oriForm, newForm) {
      const formDiff = updatedDiff(oriForm, newForm)

      // Addresses are set as whole
      if (!isEqual(oriForm.addresses, newForm.addresses)) {
        formDiff.addresses = newForm.addresses
      }

      return formDiff
    },
    async updateCustomer () {
      const { cache, restore } = cacheObjKeys(this, ['customerId', 'formCustomerFactory', 'newFormCustomer'])

      const formDiff = this.formDiff(cache.formCustomerFactory(), cache.newFormCustomer)

      // Switch to view mode
      this.isEditing = false

      snackbarPush({ color: 'success', messge: 'Updated customer' })

      try {
        await this.$apollo.mutate({
          mutation: CUSTOMER_UPDATE,
          variables: { id: cache.customerId, ...formDiff }
        })
      } catch (e) {
        console.error(e)

        restore()

        // Re-open since user might close dialog
        this.open(cache.customerId)
        this.isEditing = true

        snackbarPush({ color: 'error', message: 'Unable to update customer' })
      }
    }
  }
}
</script>
