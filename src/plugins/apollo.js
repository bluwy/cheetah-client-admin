import Vue from 'vue'
import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-boost'

Vue.use(VueApollo)

const apolloClient = new ApolloClient({
  uri: process.env.VUE_APP_SERVER_URL
})

export default new VueApollo({
  defaultClient: apolloClient
})
