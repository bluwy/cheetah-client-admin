<template>
  <base-sidebar-item
    v-bind="$attrs"
    :card-props="{ loading: !!loadingCount }"
    item-title="Company Info"
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
  </base-sidebar-item>
</template>

<script>
import { formatDate } from '@/utils/common'
import BaseSidebarItem from '@/components/Common/BaseSidebarItem.vue'
import COMPANY_GET_ONE from '@/graphql/Company/GetOne.graphql'

export default {
  name: 'CompanySidebarItemInfo',
  apollo: {
    company: {
      query: COMPANY_GET_ONE,
      variables () {
        return {
          id: this.companyId
        }
      },
      loadingKey: 'loadingCount'
    }
  },
  components: {
    BaseSidebarItem
  },
  props: {
    companyId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    loadingCount: 0,
    company: {}
  }),
  methods: {
    formatDate
  }
}
</script>
