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
        @confirm="deleteCompany()"
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
import CompanySidebarItemInfo from '@/components/Company/SidebarItemInfo.vue'
import ButtonConfirm from '@/components/Common/ButtonConfirm.vue'
import { pushSnack } from '@/components/Common/SnackbarGlobal.vue'
import COMPANY_DELETE from '@/graphql/Company/Delete.graphql'
import COMPANY_GET_ALL from '@/graphql/Company/GetAll.graphql'

export default {
  name: 'CompanyTableItemMenu',
  components: {
    ButtonConfirm
  },
  props: {
    companyId: {
      type: String,
      required: true
    }
  },
  methods: {
    ...mapActions(['addSidebarItem']),
    openSidebarItemInfo () {
      this.addSidebarItem({ component: CompanySidebarItemInfo })
    },
    async deleteCompany () {
      pushSnack({ color: 'success', message: 'Removed company' })

      try {
        await this.$apollo.mutate({
          mutation: COMPANY_DELETE,
          variables: {
            id: this.companyId
          },
          update: (store, { data: { deleteCompany } }) => {
            if (deleteCompany) {
              const data = store.readQuery({ query: COMPANY_GET_ALL })

              store.writeQuery({
                query: COMPANY_GET_ALL,
                data: {
                  companys: data.companys.filter(v => v.id !== this.companyId)
                }
              })
            }
          }
        })
      } catch (e) {
        console.error(e)

        pushSnack({ color: 'error', message: 'Unable to remove company' })
      }
    }
  }
}
</script>
