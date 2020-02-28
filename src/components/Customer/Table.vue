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
        <customer-dialog-create
          ref="dialogCreate"
          v-model="dialogCreate"
          @create-customer="refetch()"
        />
        <customer-dialog-delete
          ref="dialogDelete"
          v-model="dialogDelete"
          @delete-customer="refetch()"
        />
        <customer-dialog-info
          ref="dialogInfo"
          v-model="dialogInfo"
        />
      </v-toolbar>
    </template>
    <template #item.active="{ item }">
      <v-checkbox
        class="my-0 py-0"
        :input-value="item.active"
        hide-details
        dense
        @change="updateActive(item.id, $event.target.checked)"
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
            @click.stop="$refs.dialogUpdate.open(item.id)"
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
import { isEmpty, set } from 'lodash-es'
import CustomerDialogCreate from '@/components/Customer/DialogCreate.vue'
import CustomerDialogDelete from '@/components/Customer/DialogDelete.vue'
import CustomerDialogInfo from '@/components/Customer/DialogInfo.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import CUSTOMER_GET_ALL from '@/graphql/CustomerGetAll.graphql'
import CUSTOMER_UPDATE from '@/graphql/CustomerUpdate.graphql'
import CUSTOMER_COUNT from '@/graphql/CustomerCount.graphql'

export default {
  name: 'CustomerTable',
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
      debounce: 300,
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
    CustomerDialogCreate,
    CustomerDialogDelete,
    CustomerDialogInfo
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
      default: () => ({})
    }
  },
  data: () => ({
    loadingCount: 0,
    headers: [
      { text: 'Code', value: 'code' },
      { text: 'Name', value: 'name' },
      { text: 'Technician 1', value: 'staffPrimary.username' },
      { text: 'Technician 2', value: 'staffSecondary.username' },
      { text: 'Company', value: 'companyBelong.name' },
      { text: 'Active', value: 'active' },
      { text: 'Actions', value: 'action', sortable: false }
    ],
    page: 1,
    queryLimit: 20,
    sortBy: ['name'],
    sortDesc: [false],
    searchQuery: '',
    customers: [],
    customerCount: 0,
    dialogCreate: false,
    dialogInfo: false,
    dialogDelete: false
  }),
  computed: {
    queryOffset () {
      return this.queryLimit * (this.page - 1)
    },
    queryOrderBy () {
      const sortBy = {}
      const sortCount = Math.min(this.sortBy.length, this.sortDesc.length)

      for (let i = 0; i < sortCount; i++) {
        set(sortBy, this.sortBy[i], this.sortDesc[i] ? 'DESC' : 'ASC')
      }

      return sortBy
    },
    queryWhere () {
      const andWheres = []

      if (!isEmpty(this.extraQueryWhere)) {
        andWheres.push(this.extraQueryWhere)
      }

      if (this.searchable && this.searchQuery) {
        andWheres.push({
          code: { equals: this.searchQuery },
          name: { equals: this.searchQuery },
          staffPrimary: {
            username: { equals: this.searchQuery }
          },
          staffSecondary: {
            username: { equals: this.searchQuery }
          },
          companyBelong: {
            name: { equals: this.searchQuery }
          }
        })
      }

      return andWheres.length > 0 ? { AND: andWheres } : undefined
    }
  },
  methods: {
    refetch () {
      this.$apollo.queries.customers.refetch()
    },
    async updateActive (customerId, newActive) {
      try {
        await this.$apollo.mutate({
          mutation: CUSTOMER_UPDATE,
          variables: { id: customerId, active: newActive }
        })
      } catch (e) {
        console.error(e)

        snackbarPush({ color: 'error', message: 'Unable to toggle active' })
      }
    }
  }
}
</script>
