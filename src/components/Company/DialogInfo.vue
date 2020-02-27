<template>
  <v-dialog
    v-bind="$attrs"
    width="400"
    max-width="95vw"
  >
    <v-card :loading="!!loadingCount">
      <v-toolbar flat>
        <v-toolbar-title>Company Info</v-toolbar-title>
        <v-spacer />
        <v-tooltip top>
          <template #activator="{ on }">
            <v-btn
              icon
              disabled
              color="warning"
              v-on="on"
            >
              <v-icon>
                mdi-pencil
              </v-icon>
            </v-btn>
          </template>
          <span>
            Company has no field that can be updated
          </span>
        </v-tooltip>
        <v-btn
          icon
          color="primary"
          @click="close()"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-container fluid>
          <v-input prepend-icon="mdi-account">
            {{ company.name }}
          </v-input>
          <v-input prepend-icon="mdi-at">
            {{ company.alias }}
          </v-input>
          <v-input prepend-icon="mdi-cake-variant">
            {{ formatDate(company.createdAt) }}
          </v-input>
          <v-input prepend-icon="mdi-update">
            {{ formatDate(company.updatedAt) }}
          </v-input>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import COMPANY_GET_ONE from '@/graphql/Company/GetOne.graphql'
import { formatDate } from '@/utils/common'

export default {
  name: 'CompanyDialogInfo',
  apollo: {
    company: {
      query: COMPANY_GET_ONE,
      variables: {
        id: this.companyId
      },
      loadingKey: 'loadingCount'
    }
  },
  data: () => ({
    valid: false,
    loadingCount: 0,
    company: {},
    companyId: ''
  }),
  methods: {
    formatDate,
    open (companyId) {
      this.companyId = companyId
      this.$emit('input', true)
    }
  }
}
</script>
