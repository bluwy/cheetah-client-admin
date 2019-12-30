<template>
  <v-data-table
    :headers="headers"
    :items="companies"
    :loading="!!loadingCount"
    hide-default-footer
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Companies</v-toolbar-title>
        <v-spacer />
        <v-btn
          color="primary"
          @click.stop="dialogCreate = true"
        >
          <v-icon left>
            mdi-plus-circle
          </v-icon>
          Create
        </v-btn>
        <dialog-company-create v-model="dialogCreate" />
        <dialog-company-delete
          ref="dialogDelete"
          v-model="dialogDelete"
        />
      </v-toolbar>
    </template>
    <template #item.action="{ item }">
      <v-tooltip top>
        <span>Remove company</span>
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
import DialogCompanyCreate from '@/components/DialogCompanyCreate.vue'
import DialogCompanyDelete from '@/components/DialogCompanyDelete.vue'
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
    DialogCompanyCreate,
    DialogCompanyDelete
  },
  data: () => ({
    loadingCount: 0,
    headers: [
      { text: 'Alias', value: 'alias' },
      { text: 'Name', value: 'name' },
      { text: 'Actions', value: 'action', sortable: false }
    ],
    companies: [],
    dialogCreate: false,
    dialogDelete: false
  }),
  methods: {
    refetch () {
      this.$apollo.queries.companies.refetch()
    }
  }
}
</script>

<style>

</style>
