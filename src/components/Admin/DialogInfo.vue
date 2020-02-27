<template>
  <v-dialog
    v-bind="$attrs"
    width="400"
    max-width="95vw"
  >
    <v-card :loading="!!loadingCount">
      <v-toolbar flat>
        <v-toolbar-title>Admin Info</v-toolbar-title>
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
            Admin has no field that can be updated
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
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { format } from 'date-fns'
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
  data: () => ({
    valid: false,
    loadingCount: 0,
    admin: {},
    adminId: ''
  }),
  methods: {
    open (adminId) {
      this.adminId = adminId
      this.$emit('input', true)
    },
    formatDate (date) {
      return format(new Date(date), 'd MMM yyyy')
    }
  }
}
</script>
