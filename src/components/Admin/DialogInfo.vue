<template>
  <base-dialog
    v-bind="$attrs"
    :card-props="{ loading: !!loadingCount }"
    dialog-title="Admin Info"
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
  </base-dialog>
</template>

<script>
import { formatDate } from '@/utils/common'
import BaseDialog from '@/components/Common/BaseDialog.vue'
import ADMIN_GET_ONE from '@/graphql/Admin/GetOne.graphql'

export default {
  name: 'AdminDialogInfo',
  apollo: {
    admin: {
      query: ADMIN_GET_ONE,
      variables: {
        id: this.adminId
      },
      loadingKey: 'loadingCount'
    }
  },
  components: {
    BaseDialog
  },
  data: () => ({
    loadingCount: 0,
    admin: {},
    adminId: ''
  }),
  methods: {
    formatDate,
    open (adminId) {
      this.adminId = adminId
      this.$emit('input', true)
    }
  }
}
</script>
