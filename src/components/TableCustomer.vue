<template>
  <v-data-table
    :headers="headers"
    :items="customers"
    :server-items-length="queryLimit"
    :page.sync="page"
    :sort-by.sync="sortBy"
    :sort-desc.sync="sortDesc"
    :loading="!!loadingCount"
    must-sort
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Customers</v-toolbar-title>
        <v-spacer />
        <v-btn
          class="mr-3"
          icon
          color="primary"
          @click="refetch()"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <dialog-customer-create
          v-model="dialogCreate"
          @create-customer="refetch()"
        >
          <template #activator>
            <v-btn
              color="primary"
              @click.stop="dialogCreate = true"
            >
              <v-icon left>
                mdi-plus-circle
              </v-icon>
              Create
            </v-btn>
          </template>
        </dialog-customer-create>
        <dialog-customer-update
          v-model="dialogUpdate"
          :customer-id="targetCustomerId"
          @update-customer="refetch()"
        />
        <dialog-customer-delete
          v-model="dialogDelete"
          :customer-id="targetCustomerId"
          @delete-customer="refetch()"
        />
      </v-toolbar>
    </template>
    <template #item.temporary="{ item }">
      <v-checkbox
        class="my-0 py-0"
        :input-value="item.temporary"
        hide-details
        dense
        @change="toggleTemporary(item)"
      />
    </template>
    <template #item.active="{ item }">
      <v-checkbox
        class="my-0 py-0"
        :input-value="item.active"
        hide-details
        dense
        @change="toggleActive(item)"
      />
    </template>
    <template #item.action="{ item }">
      <v-tooltip top>
        <span>Update customer</span>
        <template #activator="{ on }">
          <v-btn
            icon
            small
            color="warning"
            v-on="on"
            @click.stop="openDialogUpdate(item.id)"
          >
            <v-icon small>
              mdi-pencil
            </v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      <v-tooltip top>
        <span>Remove customer</span>
        <template #activator="{ on }">
          <v-btn
            icon
            small
            color="error"
            v-on="on"
            @click.stop="openDialogDelete(item.id)"
          >
            <v-icon small>
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script>
import DialogCustomerCreate from '@/components/DialogCustomerCreate.vue'
import DialogCustomerUpdate from '@/components/DialogCustomerUpdate.vue'
import DialogCustomerDelete from '@/components/DialogCustomerDelete.vue'
import CUSTOMER_GET_ALL from '@/graphql/CustomerGetAll.graphql'
import CUSTOMER_UPDATE from '@/graphql/CustomerUpdate.graphql'
import FRAGMENT_CUSTOMER from '@/graphql/fragments/Customer.graphql'
import { snackbarPush } from './SnackbarGlobal.vue'

export default {
  name: 'TableCustomer',
  apollo: {
    customers: {
      query: CUSTOMER_GET_ALL,
      variables () {
        return {
          offset: this.queryOffset,
          limit: this.queryLimit,
          orderBy: this.queryOrderBy,
          where: this.queryWhere
        }
      },
      loadingKey: 'loadingCount'
    }
  },
  components: {
    DialogCustomerCreate,
    DialogCustomerUpdate,
    DialogCustomerDelete
  },
  props: {
    queryLimit: {
      type: Number,
      default: 10
    }
  },
  data: () => ({
    loadingCount: 0,
    headers: [
      { text: 'Code', value: 'code' },
      { text: 'Name', value: 'name' },
      { text: 'Email', value: 'email' },
      { text: 'Phone', value: 'phoneNumber' },
      { text: 'PIC', value: 'staffPrimary.username', sortable: false },
      { text: 'Assist', value: 'staffSecondary.username', sortable: false },
      { text: 'Handled By', value: 'companyBelong.name', sortable: false },
      { text: 'Temporary', value: 'temporary', sortable: false },
      { text: 'Active', value: 'active', sortable: false },
      { text: 'Actions', value: 'action', sortable: false }
    ],
    page: 1,
    sortBy: 'id',
    sortDesc: false,
    showTemporary: false,
    showActive: true,
    customers: [],
    dialogCreate: false,
    dialogUpdate: false,
    dialogDelete: false,
    targetCustomerId: ''
  }),
  computed: {
    queryOffset () {
      return this.queryLimit * (this.page - 1)
    },
    queryOrderBy () {
      return { [this.sortBy]: this.sortDesc ? 'desc' : 'asc' }
    },
    queryWhere () {
      return {
        AND: [
          { temporary: { equals: this.showTemporary } },
          { active: { equals: this.showActive } }
        ]
      }
    }
  },
  methods: {
    refetch () {
      this.$apollo.queries.customers.refetch()
    },
    openDialogUpdate (customerId) {
      this.targetCustomerId = customerId
      this.dialogUpdate = true
    },
    openDialogDelete (customerId) {
      this.targetCustomerId = customerId
      this.dialogDelete = true
    },
    async toggleTemporary (customer) {
      const { id, temporary } = customer

      try {
        await this.$apollo.mutate({
          mutation: CUSTOMER_UPDATE,
          variables: { id, temporary: !temporary },
          update: (store, { data: { updateCustomer } }) => {
            const data = store.readFragment({
              id,
              fragment: FRAGMENT_CUSTOMER
            })

            data.temporary = !temporary

            store.writeFragment({
              id,
              fragment: FRAGMENT_CUSTOMER,
              data
            })
          }
        })
      } catch (e) {
        console.log(e)
        snackbarPush({ color: 'error', message: 'Unable to toggle temporary' })
      }
    },
    async toggleActive (customer) {
      const { id, active } = customer

      try {
        await this.$apollo.mutate({
          mutation: CUSTOMER_UPDATE,
          variables: { id, active: !active },
          update: (store, { data: { updateCustomer } }) => {
            const data = store.readFragment({
              id,
              fragment: FRAGMENT_CUSTOMER
            })

            data.active = !active

            store.writeFragment({
              id,
              fragment: FRAGMENT_CUSTOMER,
              data
            })
          }
        })
      } catch (e) {
        console.log(e)
        snackbarPush({ color: 'error', message: 'Unable to toggle active' })
      }
    }
  }
}
</script>

<style>

</style>
