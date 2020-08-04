import { ApolloClient, InMemoryCache } from '@apollo/client';
import typePolicies from './store/policies';

const client = new ApolloClient({
  uri: import.meta.env.VITE_BACKEND_URL,
  cache: new InMemoryCache({
    typePolicies,
  }),
});

export default client;
