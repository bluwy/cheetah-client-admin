<template>
  <v-dialog
    v-bind="$attrs"
    width="700"
    max-width="95vw"
    persistent
    v-on="$listeners"
  >
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      @submit.prevent="updateCustomer()"
    >
      <v-card>
        <v-card-title>
          <v-row no-gutters>
            <v-col>Customer Details</v-col>
            <v-col cols="auto">
              <v-btn
                icon
                color="primary"
              >
                <v-icon @click="close()">
                  mdi-close
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-container fluid>
          <v-card-title class="pt-0">
            <v-row no-gutters>
              <v-col
                cols="auto"
                style="width: 120px;"
              >
                <v-skeleton-loader
                  :loading="!!loadingCount"
                  transition="fade-transition"
                  type="heading"
                  height="38px"
                  width="95%"
                >
                  <v-text-field
                    v-model="newFormCustomer.code"
                    class="font-weight-bold"
                    placeholder="Code*"
                    hide-details
                    dense
                    solo
                    flat
                  />
                </v-skeleton-loader>
              </v-col>
              <v-col>
                <v-skeleton-loader
                  :loading="!!loadingCount"
                  transition="fade-transition"
                  type="heading"
                  height="38px"
                >
                  <v-text-field
                    v-model="newFormCustomer.name"
                    :rules="rule.name"
                    placeholder="Name*"
                    hide-details
                    dense
                    solo
                    flat
                  />
                </v-skeleton-loader>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-skeleton-loader
              class="skeleton-icon-field"
              :loading="!!loadingCount"
              :types="{ skeleton: 'avatar, text' }"
              transition="fade-transition"
              type="skeleton"
              height="38px"
              width="400px"
              max-width="100%"
            >
              <v-text-field
                v-model="newFormCustomer.phoneNumber"
                prepend-icon="mdi-phone"
                placeholder="Phone number"
                hide-details
                dense
                solo
                flat
              />
            </v-skeleton-loader>
            <v-skeleton-loader
              class="skeleton-icon-field"
              :loading="!!loadingCount"
              :types="{ skeleton: 'avatar, text' }"
              transition="fade-transition"
              type="skeleton"
              height="38px"
              width="400px"
              max-width="100%"
            >
              <v-text-field
                v-model="newFormCustomer.email"
                :rules="rule.email"
                prepend-icon="mdi-email"
                placeholder="Email"
                hide-details
                dense
                solo
                flat
              />
            </v-skeleton-loader>
            <v-skeleton-loader
              class="skeleton-icon-field"
              :loading="!!loadingCount"
              :types="{ skeleton: 'avatar, text' }"
              transition="fade-transition"
              type="skeleton"
              height="88px"
              width="400px"
              max-width="100%"
            >
              <input-addresses
                :addresses="newFormCustomer.addresses"
                prepend-icon="mdi-map-marker"
              />
            </v-skeleton-loader>
            <v-row>
              <v-col cols="12">
                <input-company
                  v-model="newFormCustomer.companyBelongId"
                  :loading="!!loadingCount"
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
                  v-model="newFormCustomer.staffPrimaryId"
                  :staffs-filter="v => v.id !== newFormCustomer.staffSecondaryId"
                  :loading="!!loadingCount"
                  label="Handled by"
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
                  v-model="newFormCustomer.staffSecondaryId"
                  :staffs-filter="v => v.id !== newFormCustomer.staffPrimaryId"
                  :loading="!!loadingCount"
                  label="Assisted by"
                  hide-details
                  dense
                  clearable
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-container>
        <v-card-actions v-if="isDirty">
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
            Edit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { isEqual, cloneDeep, merge } from 'lodash-es'
import { updatedDiff } from 'deep-object-diff'
import { getErrorMessages } from '@/utils/apollo'
import { cacheObjKeys, transformObj } from '@/utils/common'
import { required, email } from '@/utils/inputRules'
import DialogYesNo from '@/components/DialogYesNo.vue'
import InputAddresses from '@/components/InputAddresses.vue'
import InputCompany from '@/components/InputCompany.vue'
import InputStaff from '@/components/InputStaff'
import { snackbarPush } from './SnackbarGlobal.vue'
import CUSTOMER_GET from '@/graphql/CustomerGet.graphql'
import CUSTOMER_UPDATE from '@/graphql/CustomerUpdate.graphql'

export default {
  name: 'DialogCustomerDetails',
  apollo: {
    customer: {
      query: CUSTOMER_GET,
      variables () {
        return {
          id: this.customerId
        }
      },
      skip () {
        return !this.customerId
      },
      loadingKey: 'loadingCount'
    }
  },
  components: {
    DialogYesNo,
    InputAddresses,
    InputCompany,
    InputStaff
  },
  data: () => ({
    valid: false,
    loadingCount: 0,
    // Customer from server
    customerId: '',
    customer: {},
    // Customer to be edited by form
    formCustomerFactory: () => ({
      code: '',
      name: '',
      addresses: [],
      phoneNumber: '',
      companyBelongId: '',
      email: '',
      staffPrimaryId: '',
      staffSecondaryId: ''
    }),
    oriFormCustomer: {},
    newFormCustomer: {},
    rule: {
      code: [required],
      name: [required],
      email: [email]
    },
    dialogClose: false
  }),
  computed: {
    isDirty () {
      return !isEqual(this.oriFormCustomer, this.newFormCustomer)
    }
  },
  watch: {
    customer (val) {
      this.formCustomerFactory = () => ({
        code: val.code,
        name: val.name,
        addresses: cloneDeep(val.addresses || []),
        phoneNumber: val.phoneNumber,
        companyBelongId: val.companyBelong.id || '',
        email: val.email,
        staffPrimaryId: val.staffPrimary.id || '',
        staffSecondaryId: (val.staffSecondary && val.staffSecondary.id) || ''
      })

      this.reset()
    }
  },
  created () {
    this.reset()
  },
  methods: {
    open (customerId) {
      this.customerId = customerId
      this.$emit('input', true)
    },
    close (force) {
      if (!force && this.isDirty) {
        this.dialogClose = true
      } else {
        this.reset()
        this.$emit('input', false)
      }
    },
    reset () {
      this.oriFormCustomer = this.formCustomerFactory()
      this.newFormCustomer = this.formCustomerFactory()
      this.$refs.form && this.$refs.form.resetValidation()
    },
    formDiff (oriForm, newForm) {
      const formDiff = updatedDiff(oriForm, newForm)

      // Addresses are set as whole
      if (!isEqual(oriForm.addresses, newForm.addresses)) {
        formDiff.addresses = newForm.addresses
      }

      return formDiff
    },
    parseFormToVars (form) {
      return transformObj(cloneDeep(form), [
        { from: 'companyBelongId', to: 'companyBelongWhere', value: v => ({ id: v }) },
        { from: 'staffPrimaryId', to: 'staffPrimaryWhere', value: v => ({ id: v }) },
        { from: 'staffSecondaryId', to: 'staffSecondaryWhere', value: v => ({ id: v }) }
      ])
    },
    async updateCustomer () {
      if (this.$refs.form.validate() && this.isDirty) {
        const { cache, restore } = cacheObjKeys(this, ['customerId', 'oriFormCustomer', 'newFormCustomer'])

        const formDiff = this.formDiff(cache.oriFormCustomer, cache.newFormCustomer)

        const optimisticResponse = {
          updateCustomer: merge(cloneDeep(this.customer), formDiff)
        }

        this.close(true)

        try {
          await this.$apollo.mutate({
            mutation: CUSTOMER_UPDATE,
            variables: {
              id: cache.customerId,
              ...this.parseFormToVars(formDiff)
            },
            optimisticResponse
          })

          snackbarPush({ color: 'success', message: 'Customer updated' })
        } catch (e) {
          restore()
          this.open(cache.customerId)

          snackbarPush({ color: 'error', message: getErrorMessages(e).join(', ') })
        }
      }
    }
  }
}
</script>

<style scoped>
.skeleton-icon-field {
  display: flex;
}

.skeleton-icon-field >>> .v-skeleton-loader__text {
  margin: 0;
  margin-top: 13px;
}

.skeleton-icon-field >>> .v-skeleton-loader__avatar {
  width: 32px;
  height: 32px;
  margin-right: 6px;
}
</style>
