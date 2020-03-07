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
      <button-confirm
        confirm-text="Confirm?"
        @confirm="resetStaffPairing()"
      >
        <template #activator="{ on }">
          <v-list-item
            color="warning"
            v-on="on"
          >
            <v-list-item-icon>
              <v-icon color="warning">
                mdi-lock
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Reset Pairing</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </button-confirm>
      <button-confirm
        confirm-text="Confirm?"
        @confirm="deleteStaff()"
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
import StaffSidebarItemInfo from '@/components/Staff/SidebarItemInfo.vue'
import ButtonConfirm from '@/components/Common/ButtonConfirm.vue'
import { pushSnack } from '@/components/Common/SnackbarGlobal.vue'
import STAFF_RESET_PAIRING from '@/graphql/Staff/ResetPairing.graphql'
import STAFF_DELETE from '@/graphql/Staff/Delete.graphql'
import STAFF_GET_ALL from '@/graphql/Staff/GetAll.graphql'

export default {
  name: 'StaffTableItemMenu',
  components: {
    ButtonConfirm
  },
  props: {
    staffId: {
      type: String,
      required: true
    }
  },
  methods: {
    ...mapActions(['addSidebarItem']),
    openSidebarItemInfo () {
      this.addSidebarItem({
        component: StaffSidebarItemInfo,
        props: {
          staffId: this.staffId
        }
      })
    },
    async resetStaffPairing () {
      pushSnack({ color: 'success', message: 'Resetted staff pairing' })

      try {
        await this.$apollo.mutate({
          mutation: STAFF_RESET_PAIRING,
          variables: {
            id: this.staffId
          }
        })
      } catch (e) {
        console.error(e)

        pushSnack({ color: 'error', message: 'Unable to reset staff pairing' })
      }
    },
    async deleteStaff () {
      pushSnack({ color: 'success', message: 'Removed staff' })

      try {
        await this.$apollo.mutate({
          mutation: STAFF_DELETE,
          variables: {
            id: this.staffId
          },
          update: (store, { data: { deleteStaff } }) => {
            if (deleteStaff) {
              const data = store.readQuery({ query: STAFF_GET_ALL })

              store.writeQuery({
                query: STAFF_GET_ALL,
                data: {
                  staffs: data.staffs.filter(v => v.id !== this.staffId)
                }
              })
            }
          }
        })
      } catch (e) {
        console.error(e)

        pushSnack({ color: 'error', message: 'Unable to remove staff' })
      }
    }
  }
}
</script>
