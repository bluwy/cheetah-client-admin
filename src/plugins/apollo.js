import Vue from 'vue'
import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-boost'

Vue.use(VueApollo)

export const apolloClient = new ApolloClient({
  uri: process.env.VUE_APP_SERVER_URL,
  credentials: 'include'
})

export default new VueApollo({
  defaultClient: apolloClient
})
