<template>
  <v-data-table
    :headers="headers"
    :items="companies"
    :loading="!!loadingCount"
    sort-by="name"
    hide-default-footer
    must-sort
    @click:row="$refs.dialogInfo.open($event.id)"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Companies</v-toolbar-title>
        <v-spacer />
        <v-btn
          class="mr-3"
          icon
          color="primary"
          @click.stop="refetch()"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-btn
          color="primary"
          @click.stop="dialogCreate = true"
        >
          <v-icon left>
            mdi-plus-circle
          </v-icon>
          Create
        </v-btn>
        <company-dialog-create v-model="dialogCreate" />
        <company-dialog-delete
          ref="dialogDelete"
          v-model="dialogDelete"
        />
        <company-dialog-info
          ref="dialogInfo"
          v-model="dialogInfo"
        />
      </v-toolbar>
    </template>
    <template #item.menu="{ item }">
      <v-menu>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            color="primary"
            v-on="on"
          >
            <v-icon>
              mdi-dots-horizontal
            </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            color="primary"
            @click.stop="$refs.dialogInfo.open(item.id)"
          >
            <v-list-item-icon>
              <v-icon>mdi-information</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Info</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            color="error"
            @click.stop="$refs.dialogDelete.open(item.id)"
          >
            <v-list-item-icon>
              <v-icon>mdi-delete</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Remove company</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-data-table>
</template>

<script>
import CompanyDialogCreate from '@/components/Company/DialogCreate.vue'
import CompanyDialogDelete from '@/components/Company/DialogDelete.vue'
import CompanyDialogInfo from '@/components/Company/DialogInfo.vue'
import COMPANY_GET_ALL from '@/graphql/CompanyGetAll.graphql'

export default {
  name: 'TableCompany',
  apollo: {
    companies: {
      query: COMPANY_GET_ALL,
      loadingKey: 'loadingCount'
    }
  },
  components: {
    CompanyDialogCreate,
    CompanyDialogDelete,
    CompanyDialogInfo
  },
  data: () => ({
    loadingCount: 0,
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'Alias', value: 'alias' },
      { text: '', value: 'menu', sortable: false }
    ],
    companies: [],
    dialogCreate: false,
    dialogDelete: false,
    dialogInfo: false
  }),
  methods: {
    refetch () {
      this.$apollo.queries.companies.refetch()
    }
  }
}
</script>
