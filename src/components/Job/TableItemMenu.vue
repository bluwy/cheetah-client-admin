<template>
  <v-menu>
    <template #activator="{ on }">
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
    <v-list dense>
      <v-list-item
        color="primary"
        @click.stop="openSidebarItemInfo()"
      >
        <v-list-item-icon>
          <v-icon color="primary">
            mdi-information
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Info</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        v-if="canReassign"
        color="warning"
        @click.stop="openSidebarItemReassign()"
      >
        <v-list-item-icon>
          <v-icon color="warning">
            mdi-clipboard-text
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Reassign</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        v-if="canFollowUp"
        color="warning"
        @click.stop="openSidebarItemFollowUp()"
      >
        <v-list-item-icon>
          <v-icon color="warning">
            mdi-clipboard-text
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Follow Up</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <button-confirm
        confirm-text="Confirm?"
        @confirm="deleteJob()"
      >
        <template #activator="{ on }">
          <v-list-item
            color="error"
            v-on="on"
          >
            <v-list-item-icon>
              <v-icon color="error">
                mdi-delete
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Remove</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </button-confirm>
    </v-list>
  </v-menu>
</template>

<script>
import { mapActions } from 'vuex'
import { storeDeleteQuery } from '@/utils/apollo'
import JobSidebarItemInfo from '@/components/Job/SidebarItemInfo.vue'
import JobSidebarItemReassign from '@/components/Job/SidebarItemReassign.vue'
import JobSidebarItemCreate from '@/components/Job/SidebarItemCreate.vue'
import ButtonConfirm from '@/components/Common/ButtonConfirm.vue'
import { refetch } from '@/components/Job/Table.vue'
import { pushSnack } from '@/components/Common/SnackbarGlobal.vue'
import JOB_DELETE from '@/graphql/Job/Delete.graphql'
import JOB_GET_ONE from '@/graphql/Job/GetOne.graphql'

export default {
  name: 'JobTableItemMenu',
  apollo: {
    job: {
      query: JOB_GET_ONE,
      variables () {
        return {
          id: this.jobId
        }
      }
    }
  },
  components: {
    ButtonConfirm
  },
  props: {
    jobId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    job: {}
  }),
  computed: {
    canReassign () {
      // Haven't check out means haven't done
      return this.job.checkOut == null
    },
    canFollowUp () {
      return this.job.state === 'FOLLOW_UP'
    }
  },
  methods: {
    ...mapActions(['addSidebarItem']),
    openSidebarItemInfo () {
      this.addSidebarItem({
        component: JobSidebarItemInfo,
        props: {
          jobId: this.jobId
        }
      })
    },
    openSidebarItemReassign () {
      this.addSidebarItem({
        component: JobSidebarItemReassign,
        props: {
          prevJobId: this.jobId
        }
      })
    },
    openSidebarItemFollowUp () {
      this.addSidebarItem({
        component: JobSidebarItemCreate,
        props: {
          followUpJobId: this.jobId
        }
      })
    },
    async deleteJob () {
      pushSnack({ color: 'success', message: 'Removed job' })

      try {
        await this.$apollo.mutate({
          mutation: JOB_DELETE,
          variables: {
            id: this.jobId
          },
          update: (store, { data: { deleteJob } }) => {
            if (deleteJob) {
              storeDeleteQuery(store, /^jobs/)
            }
          }
        })

        refetch()
      } catch (e) {
        console.error(e)

        pushSnack({ color: 'error', message: 'Unable to remove job' })
      }
    }
  }
}
</script>
