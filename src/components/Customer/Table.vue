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
    class="overflow-hidden"
    must-sort
    @click:row="openSidebarItemInfo($event.id)"
  >
    <template #top>
      <v-toolbar
        flat
        color="primary lighten-5"
      >
        <v-toolbar-title>{{ tableTitle }}</v-toolbar-title>
        <v-spacer />
        <input-search
          v-if="searchable"
          v-model="searchQuery"
        />
        <v-btn
          class="mx-3"
          icon
          color="primary"
          @click.stop="refetch()"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-btn
          color="primary"
          @click.stop="openSidebarItemCreate()"
        >
          <v-icon left>
            mdi-plus-circle
          </v-icon>
          Add Customer
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
import { mapActions } from 'vuex'
import { isEmpty, set } from 'lodash-es'
import collectInstanceMixin from '@/mixins/collect-instance'
import TableItemMenu from '@/components/Customer/TableItemMenu.vue'
import CustomerSidebarItemCreate from '@/components/Customer/SidebarItemCreate.vue'
import CustomerSidebarItemInfo from '@/components/Customer/SidebarItemInfo.vue'
import InputSearch from '@/components/Common/InputSearch.vue'
import { pushSnack } from '@/components/Common/SnackbarGlobal.vue'
import CUSTOMER_GET_ALL from '@/graphql/Customer/GetAll.graphql'
import CUSTOMER_UPDATE from '@/graphql/Customer/Update.graphql'
import CUSTOMER_COUNT from '@/graphql/Customer/Count.graphql'

const instances = []

export const refetch = () => {
  instances.forEach(v => v.refetch())
}

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
    TableItemMenu,
    InputSearch
  },
  mixins: [collectInstanceMixin(instances)],
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
      { text: 'Active', value: 'active', width: 100 },
      { text: '', value: 'menu', width: 0, sortable: false }
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
    ...mapActions(['addSidebarItem']),
    refetch () {
      this.$apollo.queries.customers.refetch()
    },
    openSidebarItemCreate () {
      this.addSidebarItem({ component: CustomerSidebarItemCreate })
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
