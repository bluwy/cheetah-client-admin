<template>
  <v-dialog :value="value" persistent width="700">
    <template v-for="(_, slot) in $scopedSlots" #[slot]="scope">
      <slot :name="slot" v-bind="scope"></slot>
    </template>
    <v-form v-model="valid" ref="form" lazy-validation>
      <v-card>
        <v-card-title>Edit Customer</v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-row no-gutters>
              <v-col cols="12" md="4">
                <v-subheader>General</v-subheader>
              </v-col>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="currentCustomer.code"
                  :rules="rule.code"
                  label="Code"
                ></v-text-field>
                <v-text-field
                  v-model="currentCustomer.name"
                  :rules="rule.name"
                  label="Name"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12" md="4">
                <v-subheader>Description</v-subheader>
              </v-col>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="currentCustomer.address"
                  label="Address"
                ></v-text-field>
                <v-text-field
                  v-model="currentCustomer.phoneNumber"
                  label="Phone Number"
                ></v-text-field>
                <v-text-field
                  v-model="currentCustomer.email"
                  :rules="rule.email"
                  label="Email"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12" md="4">
                <v-subheader>Person in charge</v-subheader>
              </v-col>
              <v-col cols="12" md="8">
                <input-staff v-model="currentCustomer.personInCharge.id"></input-staff>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <dialog-yes-no
            v-model="cancelDialog"
            header="Are you sure?"
            message="You cannot undo this action."
            @yes="cancel(true)"
          >
            <template #activator>
              <v-btn outlined color="error" @click.stop="cancel()">Cancel</v-btn>
            </template>
          </dialog-yes-no>
          <v-btn color="primary" @click="edit()">Edit</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { cloneDeep, isEqual } from 'lodash-es'
import { getErrorMessages, storeDeleteQuery } from '@/utils/apollo'
import { required, email } from '@/utils/inputRules'
import DialogYesNo from '@/components/DialogYesNo.vue'
import InputStaff from '@/components/InputStaff'
import { snackbarPush } from './SnackbarGlobal.vue'
import CUSTOMER_GET from '@/graphql/CustomerGet.graphql'
import CUSTOMER_UPDATE from '@/graphql/CustomerUpdate.graphql'

const formCustomerFactory = () => ({
  code: '',
  name: '',
  address: '',
  phoneNumber: '',
  email: '',
  personInCharge: {
    id: ''
  }
})

export default {
  name: 'DialogCustomerEdit',
  apollo: {
    customer: {
      query: CUSTOMER_GET,
      variables () {
        return {
          id: this.customerId
        }
      },
      result ({ data: { customer } }) {
        // Provide default object so id can be edited
        if (customer.personInCharge == null) {
          customer.personInCharge = {}
        }
      },
      skip () {
        return !this.value
      }
    }
  },
  components: {
    DialogYesNo,
    InputStaff
  },
  props: {
    value: {
      type: Boolean
    },
    customerId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    valid: false,
    customer: formCustomerFactory(),
    currentCustomer: formCustomerFactory(),
    rule: {
      code: [required],
      name: [required],
      email: [email]
    },
    cancelDialog: false
  }),
  computed: {
    isDirty () {
      return !isEqual(this.customer, this.currentCustomer)
    }
  },
  watch: {
    customer (val) {
      // When customerId change, clone new staff to enable dirty comparison
      this.currentCustomer = cloneDeep(val)
    }
  },
  methods: {
    cancel (force) {
      if (!force && this.isDirty) {
        this.cancelDialog = true
      } else {
        this.reset()
        this.$emit('input', false)
      }
    },
    reset () {
      this.currentCustomer = cloneDeep(this.customer)
      this.$refs.form.resetValidation()
    },
    async edit () {
      if (this.$refs.form.validate() && this.isDirty) {
        const cacheCustomerId = this.customerId
        const cacheCustomer = cloneDeep(this.currentCustomer)

        this.cancel(true)

        try {
          const { data: { updateCustomer } } = await this.$apollo.mutate({
            mutation: CUSTOMER_UPDATE,
            variables: {
              id: cacheCustomerId,
              code: cacheCustomer.code,
              name: cacheCustomer.name,
              address: cacheCustomer.address,
              phoneNumber: cacheCustomer.phoneNumber,
              email: cacheCustomer.email,
              picStaffId: cacheCustomer.personInCharge.id
            },
            update: (store, { data: { updateCustomer } }) => {
              if (updateCustomer.success) {
                storeDeleteQuery(store, /^customers/)
                console.log(store)
                this.$emit('edit')
              } else {
                throw new Error(updateCustomer.message)
              }
            }
          })

          snackbarPush({ color: 'success', message: updateCustomer.message })
        } catch (e) {
          this.currentCustomer = cacheCustomer
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
