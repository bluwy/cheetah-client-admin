<template>
  <v-data-table
    :headers="headers"
    :items="customers"
    :server-items-length="customerCount"
    :items-per-page.sync="queryLimit"
    :page.sync="page"
    :sort-by.sync="sortBy"
    :sort-desc.sync="sortDesc"
    :loading="!!loadingCount"
    :footer-props="{ itemsPerPageOptions: [5, 10, 15, 20] }"
    must-sort
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>{{ tableTitle }}</v-toolbar-title>
        <v-spacer />
        <v-text-field
          v-if="searchable"
          v-model="searchQuery"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        />
        <v-btn
          class="mr-3"
          icon
          color="primary"
          @click.stop="refetch()"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <dialog-customer-details
          ref="dialogDetails"
          v-model="dialogDetails"
        />
        <dialog-customer-delete
          ref="dialogDelete"
          v-model="dialogDelete"
          @delete-customer="refetch()"
        />
      </v-toolbar>
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
        <span>Customer details</span>
        <template #activator="{ on }">
          <v-btn
            icon
            small
            color="primary"
            v-on="on"
            @click.stop="$refs.dialogDetails.open(item.id)"
          >
            <v-icon small>
              mdi-information
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
            @click.stop="$refs.dialogDelete.open(item.id)"
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
import { mapGetters } from 'vuex'
import DialogCustomerDetails from '@/components/DialogCustomerDetails.vue'
import DialogCustomerDelete from '@/components/DialogCustomerDelete.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import CUSTOMER_GET_ALL from '@/graphql/CustomerGetAll.graphql'
import CUSTOMER_UPDATE from '@/graphql/CustomerUpdate.graphql'
import CUSTOMER_COUNT from '@/graphql/CustomerCount.graphql'

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
    },
    customerCount: {
      query: CUSTOMER_COUNT,
      variables () {
        return {
          where: this.queryWhere
        }
      }
    }
  },
  components: {
    DialogCustomerDetails,
    DialogCustomerDelete
  },
  props: {
    tableTitle: {
      type: String,
      default: 'Customers'
    },
    searchable: {
      type: Boolean,
      default: false
    },
    extraQueryWhere: {
      type: Object,
      default: () => undefined
    }
  },
  data: () => ({
    loadingCount: 0,
    headers: [
      { text: 'Code', value: 'code' },
      { text: 'Name', value: 'name' },
      { text: 'Technician 1', value: 'staffPrimary.username', sortable: false },
      { text: 'Technician 2', value: 'staffSecondary.username', sortable: false },
      { text: 'Company', value: 'companyBelong.name', sortable: false },
      { text: 'Active', value: 'active', sortable: false },
      { text: 'Actions', value: 'action', sortable: false }
    ],
    page: 1,
    queryLimit: 20,
    sortBy: 'name',
    sortDesc: false,
    searchQuery: '',
    showActive: undefined,
    customers: [],
    customerCount: 0,
    dialogCreate: false,
    dialogDetails: false,
    dialogDelete: false
  }),
  computed: {
    ...mapGetters([
      'isPrivilegeBasic'
    ]),
    queryOffset () {
      return this.queryLimit * (this.page - 1)
    },
    queryOrderBy () {
      return { [this.sortBy]: this.sortDesc ? 'desc' : 'asc' }
    },
    queryWhere () {
      const andWheres = []

      if (this.extraQueryWhere) {
        andWheres.push(this.extraQueryWhere)
      }

      if (this.searchable && this.searchQuery) {
        andWheres.push({
          active: { equals: this.showActive }
        })
      }

      return andWheres.length > 0 ? { AND: andWheres } : undefined
    }
  },
  methods: {
    refetch () {
      this.$apollo.queries.customers.refetch()
    },
    async toggleActive (customer) {
      const { id, active } = customer

      try {
        await this.$apollo.mutate({
          mutation: CUSTOMER_UPDATE,
          variables: { id, active: !active }
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
