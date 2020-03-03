<template>
  <base-sidebar-item
    v-bind="$attrs"
    :card-props="{ loading: !!loadingCount }"
    item-title="Admin Info"
    v-on="$listeners"
  >
    <v-input prepend-icon="mdi-account">
      {{ admin.username }}
    </v-input>
    <v-input prepend-icon="mdi-shield">
      <strong>{{ admin.privilege === 'FULL' ? 'Has' : 'No' }}</strong>
      full access
    </v-input>
    <v-input prepend-icon="mdi-cake-variant">
      {{ formatDate(admin.createdAt) }}
    </v-input>
    <v-input prepend-icon="mdi-update">
      {{ formatDate(admin.updatedAt) }}
    </v-input>
  </base-sidebar-item>
</template>

<script>
import { formatDate } from '@/utils/common'
import BaseSidebarItem from '@/components/Common/BaseSidebarItem.vue'
import ADMIN_GET_ONE from '@/graphql/Admin/GetOne.graphql'

export default {
  name: 'AdminSidebarItemInfo',
  apollo: {
    admin: {
      query: ADMIN_GET_ONE,
      variables () {
        return {
          id: this.adminId
        }
      },
      loadingKey: 'loadingCount'
    }
  },
  components: {
    BaseSidebarItem
  },
  props: {
    adminId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    loadingCount: 0,
    admin: {}
  }),
  methods: {
    formatDate
  }
}
</script>
