import Vue from 'vue'
import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-boost'

Vue.use(VueApollo)

const apolloClient = new ApolloClient({
  uri: process.env.VUE_APP_SERVER_URL,
  request: (operation) => {
    operation.setContext({
      headers: {
        // TODO: Convert this to use localStorage
        authorization: process.env.VUE_APP_AUTH_JWT || ''
      }
    })
  }
})

export default new VueApollo({
  defaultClient: apolloClient
})
