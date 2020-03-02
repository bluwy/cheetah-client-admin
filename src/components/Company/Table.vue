<template>
  <v-data-table
    :headers="headers"
    :items="companies"
    :loading="!!loadingCount"
    :search="searchQuery"
    sort-by="name"
    hide-default-footer
    must-sort
    @click:row="openSidebarItemInfo()"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Companies</v-toolbar-title>
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
      </v-toolbar>
    </template>
    <template #item.menu="{ item }">
      <table-item-menu :company-id="item.id" />
    </template>
  </v-data-table>
</template>

<script>
import CompanySidebarItemInfo from '@/components/Admin/SidebarItemInfo.vue'
import TableItemMenu from '@/components/Admin/TableItemMenu.vue'
import COMPANY_GET_ALL from '@/graphql/CompanyGetAll.graphql'

export default {
  name: 'CompanyTable',
  apollo: {
    companies: {
      query: COMPANY_GET_ALL,
      variables () {
        return this.searchable && this.searchQuery ? {
          query: this.searchQuery
        } : undefined
      },
      fetchPolicy () {
        return this.searchable && this.searchQuery ? 'network-only' : 'cache-first'
      },
      debounce: 300,
      loadingKey: 'loadingCount'
    }
  },
  components: {
    TableItemMenu
  },
  props: {
    searchable: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    loadingCount: 0,
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'Alias', value: 'alias' },
      { text: '', value: 'menu', sortable: false }
    ],
    searchQuery: '',
    companies: []
  }),
  methods: {
    refetch () {
      this.$apollo.queries.companies.refetch()
    },
    openSidebarItemInfo () {
      this.addSidebarItem({ component: CompanySidebarItemInfo })
    }
  }
}
</script>
