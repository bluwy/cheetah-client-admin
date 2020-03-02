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
    <v-list>
      <v-list-item
        color="primary"
        @click.stop="openSidebarItemInfo()"
      >
        <v-list-item-icon>
          <v-icon>mdi-information</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Info</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <button-confirm
        confirm-text="Confirm?"
        @confirm="deleteAdmin()"
      >
        <template #activator="{ on }">
          <v-list-item
            color="error"
            v-on="on"
          >
            <v-list-item-icon>
              <v-icon>mdi-delete</v-icon>
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
import AdminSidebarItemInfo from '@/components/Admin/SidebarItemInfo.vue'
import ButtonConfirm from '@/components/Common/ButtonConfirm.vue'
import { pushSnack } from '@/components/Common/SnackbarGlobal.vue'
import ADMIN_DELETE from '@/graphql/Admin/Delete.graphql'
import ADMIN_GET_ALL from '@/graphql/Admin/GetAll.graphql'

export default {
  name: 'AdminTableItemMenu',
  components: {
    ButtonConfirm
  },
  props: {
    adminId: {
      type: String,
      required: true
    }
  },
  methods: {
    ...mapActions(['addSidebarItem']),
    openSidebarItemInfo () {
      this.addSidebarItem({ component: AdminSidebarItemInfo })
    },
    async deleteAdmin () {
      pushSnack({ color: 'success', message: 'Removed admin' })

      try {
        await this.$apollo.mutate({
          mutation: ADMIN_DELETE,
          variables: {
            id: this.adminId
          },
          update: (store, { data: { deleteAdmin } }) => {
            if (deleteAdmin) {
              const data = store.readQuery({ query: ADMIN_GET_ALL })

              store.writeQuery({
                query: ADMIN_GET_ALL,
                data: {
                  admins: data.admins.filter(v => v.id !== this.adminId)
                }
              })
            }
          }
        })
      } catch (e) {
        console.error(e)

        pushSnack({ color: 'error', message: 'Unable to remove admin' })
      }
    }
  }
}
</script>
