import Vue from 'vue'
import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-boost'
import { authToken } from '@/utils/localStorage'

Vue.use(VueApollo)

export const apolloClient = new ApolloClient({
  uri: process.env.VUE_APP_SERVER_URL,
  request: (operation) => {
    operation.setContext({
      headers: {
        authorization: authToken()
      }
    })
  }
})

export default new VueApollo({
  defaultClient: apolloClient
})
