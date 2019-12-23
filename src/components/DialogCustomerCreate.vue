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
        <v-card-title>Create Customer</v-card-title>
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
                  v-model="customer.code"
                  :rules="rule.code"
                  label="Code"
                />
                <v-text-field
                  v-model="customer.name"
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
                  v-model="customer.address"
                  label="Address"
                />
                <v-text-field
                  v-model="customer.phoneNumber"
                  label="Phone Number"
                />
                <v-text-field
                  v-model="customer.email"
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
                <input-staff v-model="customer.picStaffId" />
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
            @click="createCustomer()"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { getErrorMessages, storeDeleteQuery } from '@/utils/apollo'
import { required, email } from '@/utils/inputRules'
import DialogYesNo from '@/components/DialogYesNo.vue'
import InputStaff from '@/components/InputStaff'
import CUSTOMER_CREATE from '@/graphql/CustomerCreate.graphql'
import { snackbarPush } from './SnackbarGlobal.vue'

const formCustomerFactory = () => ({
  code: '',
  name: '',
  address: '',
  phoneNumber: '',
  email: '',
  picStaffId: null
})

export default {
  name: 'DialogCustomerCreate',
  components: {
    DialogYesNo,
    InputStaff
  },
  props: {
    value: {
      type: Boolean
    }
  },
  data: () => ({
    valid: false,
    customer: formCustomerFactory(),
    rule: {
      code: [required],
      name: [required],
      email: [email]
    },
    cancelDialog: false
  }),
  computed: {
    isDirty () {
      const c = this.customer
      return !!(c.code || c.name || c.address || c.phoneNumber || c.email || c.picStaffId)
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
      this.$refs.form.reset()
      this.customer = formCustomerFactory()
    },
    async createCustomer () {
      if (this.$refs.form.validate()) {
        const cacheCustomer = { ...this.customer }

        this.cancel(true)

        try {
          await this.$apollo.mutate({
            mutation: CUSTOMER_CREATE,
            variables: cacheCustomer,
            update: (store, { data: { createCustomer } }) => {
              if (createCustomer != null) {
                storeDeleteQuery(store, /^customers/)
                console.log(store)
                this.$emit('createCustomer')
              } else {
                throw new Error('Unable to create customer')
              }
            }
          })

          snackbarPush({ color: 'success', message: 'Customer created' })
        } catch (e) {
          this.customer = cacheCustomer
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
