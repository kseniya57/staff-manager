import VueApollo from 'vue-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { API_URL, AUTH_TOKEN, WS_ENDPOINT } from '../constants';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { split } from 'apollo-link';
import { setContext } from 'apollo-link-context';

export default VueApollo;

const wsClient = new SubscriptionClient(WS_ENDPOINT, {
  reconnect: true,
  connectionParams: () => {
    const authorization = localStorage.getItem(AUTH_TOKEN);
    return authorization ? { authorization } : {};
  }
});

let link;

const wsLink = new WebSocketLink(wsClient);

if (process.env.DISABLE_HTTP) {
  link = wsLink;
} else {
  const authLink = setContext((_, { headers }) => {
    const authorization = localStorage.getItem(AUTH_TOKEN);

    return {
      headers: {
        ...headers,
        authorization
      }
    };
  });

  link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    authLink.concat(new HttpLink({ uri: API_URL }))
  );
}

const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

apolloClient.wsClient = wsClient;

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});

export const restart = (resetStore = true) => {
  wsClient.close(true);
  wsClient.connect();

  if (resetStore) {
    apolloClient.resetStore().catch(console.error);
  }
};
