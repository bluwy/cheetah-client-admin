<template>
  <v-dialog
    :value="value"
    persistent
    width="700"
    max-width="95vw"
  >
    <template
      v-for="(_, slot) in $scopedSlots"
      #[slot]="scope"
    >
      <slot
        :name="slot"
        v-bind="scope"
      />
    </template>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-card>
        <v-card-title>Edit Customer</v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-row no-gutters>
              <v-col
                cols="12"
                md="4"
              >
                <v-subheader>General</v-subheader>
              </v-col>
              <v-col
                cols="12"
                md="8"
              >
                <v-text-field
                  v-model="currentCustomer.code"
                  :rules="rule.code"
                  label="Code"
                />
                <v-text-field
                  v-model="currentCustomer.name"
                  :rules="rule.name"
                  label="Name"
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col
                cols="12"
                md="4"
              >
                <v-subheader>Description</v-subheader>
              </v-col>
              <v-col
                cols="12"
                md="8"
              >
                <v-text-field
                  v-model="currentCustomer.address"
                  label="Address"
                />
                <v-text-field
                  v-model="currentCustomer.phoneNumber"
                  label="Phone Number"
                />
                <v-text-field
                  v-model="currentCustomer.email"
                  :rules="rule.email"
                  label="Email"
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col
                cols="12"
                md="4"
              >
                <v-subheader>Person in charge</v-subheader>
              </v-col>
              <v-col
                cols="12"
                md="8"
              >
                <input-staff v-model="currentCustomer.personInCharge.id" />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <dialog-yes-no
            v-model="cancelDialog"
            header="Are you sure?"
            message="You cannot undo this action."
            @yes="cancel(true)"
          >
            <template #activator>
              <v-btn
                outlined
                color="error"
                @click.stop="cancel()"
              >
                Cancel
              </v-btn>
            </template>
          </dialog-yes-no>
          <v-btn
            color="primary"
            @click="updateCustomer()"
          >
            Edit
          </v-btn>
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
  email: '',
  addresses: [],
  phoneNumber: '',
  companyId: '',
  staffPrimaryId: '',
  staffSecondaryId: '',
  temporary: false,
  active: true
})

export default {
  name: 'DialogCustomerUpdate',
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
    async updateCustomer () {
      if (this.$refs.form.validate() && this.isDirty) {
        const cacheCustomerId = this.customerId
        const cacheCustomer = cloneDeep(this.currentCustomer)

        this.cancel(true)

        try {
          await this.$apollo.mutate({
            mutation: CUSTOMER_UPDATE,
            variables: {
              id: cacheCustomerId,
              ...cacheCustomer
            },
            update: (store, { data: { updateCustomer } }) => {
              if (updateCustomer != null) {
                storeDeleteQuery(store, /^customers/)
                console.log(store)
                this.$emit('updateCustomer')
              } else {
                throw new Error('Unable to update customer')
              }
            }
          })

          snackbarPush({ color: 'success', message: 'Customer update' })
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
