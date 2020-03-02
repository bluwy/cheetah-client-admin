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
    @click:row="openSidebarItemInfo($event.id)"
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
          icon
          color="primary"
          @click.stop="refetch()"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
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
    <template #item.menu="{ item }">
      <table-item-menu :customer-id="item.id" />
    </template>
  </v-data-table>
</template>

<script>
import { isEmpty, set } from 'lodash-es'
import TableItemMenu from '@/components/Customer/TableItemMenu.vue'
import CustomerSidebarItemInfo from '@/components/Customer/SidebarItemInfo.vue'
import { pushSnack } from '@/components/Common/SnackbarGlobal.vue'
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
    TableItemMenu
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
      { text: '', value: 'menu', sortable: false }
    ],
    page: 1,
    queryLimit: 20,
    sortBy: ['name'],
    sortDesc: [false],
    searchQuery: '',
    customers: [],
    customerCount: 0
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
    openSidebarItemInfo (customerId) {
      this.addSidebarItem({
        component: CustomerSidebarItemInfo,
        props: {
          customerId
        }
      })
    },
    async updateActive (customerId, newActive) {
      try {
        await this.$apollo.mutate({
          mutation: CUSTOMER_UPDATE,
          variables: { id: customerId, active: newActive }
        })
      } catch (e) {
        console.error(e)

        pushSnack({ color: 'error', message: 'Unable to toggle active' })
      }
    }
  }
}
</script>
