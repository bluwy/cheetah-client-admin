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
    class="overflow-hidden"
    must-sort
    @click:row="openSidebarItemInfo($event.id)"
  >
    <template #top>
      <v-toolbar
        flat
        color="primary lighten-5"
      >
        <v-toolbar-title>{{ tableTitle }}</v-toolbar-title>
        <v-spacer />
        <input-search
          v-if="searchable"
          v-model="searchQuery"
        />
        <v-btn
          class="mx-3"
          icon
          color="primary"
          @click.stop="refetch()"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-btn
          color="primary"
          @click.stop="openSidebarItemCreate()"
        >
          <v-icon left>
            mdi-plus-circle
          </v-icon>
          Add Job
        </v-btn>
      </v-toolbar>
    </template>
    <template #item.createdAt="{ item }">
      {{ formatDate(item.createdAt) }}
    </template>
    <template #item.menu="{ item }">
      <table-item-menu :job-id="item.id" />
    </template>
  </v-data-table>
</template>

<script>
import { mapActions } from 'vuex'
import { isEmpty, set } from 'lodash-es'
import { formatDate } from '@/utils/common'
import collectInstanceMixin from '@/mixins/collect-instance'
import TableItemMenu from '@/components/Job/TableItemMenu.vue'
import JobSidebarItemCreate from '@/components/Job/SidebarItemCreate.vue'
import JobSidebarItemInfo from '@/components/Job/SidebarItemInfo.vue'
import InputSearch from '@/components/Common/InputSearch.vue'
import JOB_GET_ALL from '@/graphql/Job/GetAll.graphql'
import JOB_COUNT from '@/graphql/Job/Count.graphql'

const instances = []

export const refetch = () => {
  instances.forEach(v => v.refetch())
}

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
    TableItemMenu,
    InputSearch
  },
  mixins: [collectInstanceMixin(instances)],
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
      { text: '', value: 'menu', width: 0, sortable: false }
    ],
    page: 1,
    queryLimit: 20,
    sortBy: ['createdAt'],
    sortDesc: [true],
    searchQuery: '',
    jobs: [],
    jobCount: 0
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
    formatDate,
    ...mapActions(['addSidebarItem']),
    refetch () {
      this.$apollo.queries.jobs.refetch()
    },
    openSidebarItemCreate () {
      this.addSidebarItem({ component: JobSidebarItemCreate })
    },
    openSidebarItemInfo (jobId) {
      this.addSidebarItem({
        component: JobSidebarItemInfo,
        props: {
          jobId
        }
      })
    }
  }
}
</script>
