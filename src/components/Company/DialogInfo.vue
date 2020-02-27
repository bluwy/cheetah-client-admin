<template>
  <base-dialog
    v-bind="$attrs"
    :card-props="{ loading: !!loadingCount }"
    dialog-title="Company Info"
    v-on="$listeners"
  >
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
  </base-dialog>
</template>

<script>
import { formatDate } from '@/utils/common'
import BaseDialog from '@/components/BaseDialog.vue'
import COMPANY_GET_ONE from '@/graphql/Company/GetOne.graphql'

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
  components: {
    BaseDialog
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
