<template>
  <v-data-table
    :headers="headers"
    :items="jobs"
    :server-items-length="jobCount"
    :items-per-page.sync="queryLimit"
    :page.sync="page"
    :sort-by.sync="sortBy"
    :sort-desc.sync="sortDesc"
    :loading="!!loadingCount"
    :footer-props="{ itemsPerPageOptions: [5, 10, 15, 20] }"
    must-sort
    @click:row="$refs.dialogInfo.open($event.id)"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>{{ tableTitle }}</v-toolbar-title>
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
        <job-dialog-create
          ref="dialogCreate"
          v-model="dialogCreate"
          @create-job="refetch()"
        />
        <job-dialog-delete
          ref="dialogDelete"
          v-model="dialogDelete"
          @delete-job="refetch()"
        />
        <job-dialog-info
          ref="dialogInfo"
          v-model="dialogInfo"
        />
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
              <v-list-item-title>Remove</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-data-table>
</template>

<script>
import { isEmpty, set } from 'lodash-es'
import JobDialogCreate from '@/components/Job/DialogCreate.vue'
import JobDialogDelete from '@/components/Job/DialogDelete.vue'
import JobDialogInfo from '@/components/Job/DialogInfo.vue'
import { snackbarPush } from '@/components/SnackbarGlobal.vue'
import JOB_GET_ALL from '@/graphql/JobGetAll.graphql'
import JOB_UPDATE from '@/graphql/JobUpdate.graphql'
import JOB_COUNT from '@/graphql/JobCount.graphql'

export default {
  name: 'JobTable',
  apollo: {
    jobs: {
      query: JOB_GET_ALL,
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
    jobCount: {
      query: JOB_COUNT,
      variables () {
        return {
          where: this.queryWhere
        }
      }
    }
  },
  components: {
    JobDialogCreate,
    JobDialogDelete,
    JobDialogInfo
  },
  props: {
    tableTitle: {
      type: String,
      default: 'Jobs'
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
      { text: 'Customer', value: 'customer.name' },
      { text: 'Issue Date', value: 'createdAt' },
      { text: '', value: 'menu', sortable: false }
    ],
    page: 1,
    queryLimit: 20,
    sortBy: ['dateIssued'],
    sortDesc: [true],
    searchQuery: '',
    jobs: [],
    jobCount: 0,
    dialogCreate: false,
    dialogDelete: false,
    dialogInfo: false
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
          staffPrimary: {
            username: { equals: this.searchQuery }
          },
          staffSecondary: {
            username: { equals: this.searchQuery }
          },
          company: {
            name: { equals: this.searchQuery }
          }
        })
      }

      return andWheres.length > 0 ? { AND: andWheres } : undefined
    }
  },
  methods: {
    refetch () {
      this.$apollo.queries.jobs.refetch()
    },
    async updateActive (jobId, newActive) {
      try {
        await this.$apollo.mutate({
          mutation: JOB_UPDATE,
          variables: { id: jobId, active: newActive }
        })
      } catch (e) {
        console.error(e)

        snackbarPush({ color: 'error', message: 'Unable to toggle active' })
      }
    }
  }
}
</script>
