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
        @confirm="deleteCustomer()"
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
import CustomerSidebarItemInfo from '@/components/Customer/SidebarItemInfo.vue'
import ButtonConfirm from '@/components/Common/ButtonConfirm.vue'
import { pushSnack } from '@/components/Common/SnackbarGlobal.vue'
import CUSTOMER_DELETE from '@/graphql/Customer/Delete.graphql'
import CUSTOMER_GET_ALL from '@/graphql/Customer/GetAll.graphql'

export default {
  name: 'CustomerTableItemMenu',
  components: {
    ButtonConfirm
  },
  props: {
    customerId: {
      type: String,
      required: true
    }
  },
  methods: {
    ...mapActions(['addSidebarItem']),
    openSidebarItemInfo () {
      this.addSidebarItem({
        component: CustomerSidebarItemInfo,
        props: {
          customerId: this.customerId
        }
      })
    },
    async deleteCustomer () {
      pushSnack({ color: 'success', message: 'Removed customer' })

      try {
        await this.$apollo.mutate({
          mutation: CUSTOMER_DELETE,
          variables: {
            id: this.customerId
          },
          update: (store, { data: { deleteCustomer } }) => {
            if (deleteCustomer) {
              const data = store.readQuery({ query: CUSTOMER_GET_ALL })

              store.writeQuery({
                query: CUSTOMER_GET_ALL,
                data: {
                  customers: data.customers.filter(v => v.id !== this.customerId)
                }
              })
            }
          }
        })
      } catch (e) {
        console.error(e)

        pushSnack({ color: 'error', message: 'Unable to remove customer' })
      }
    }
  }
}
</script>
