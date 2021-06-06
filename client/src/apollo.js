import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink, split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { onError } from "apollo-link-error";
// import { withClientState } from "apollo-link-state";
const graphqlUrl = "http://localhost:8081/v1/graphql";
const subscriptionUrl = "ws://localhost:8081/v1/graphql";

// Instance of a cache
const cache = new InMemoryCache();

// pass authentication header when exists
const authMiddleware = new ApolloLink((operation, forward) => {
  if (localStorage.getItem("token")) {
    operation.setContext({
      headers: {
        "x-hasura-admin-secret": "myadminsecretkey3",
        "X-Hasura-User-Id": "1f46e137-f08b-40f4-9f7e-00adad57acf6",
        // "x-hasura-role": "student",
        // authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }
  return forward(operation);
});

// Set up subscription
const wsLink = new WebSocketLink({
  uri: subscriptionUrl,
  options: {
    reconnect: true,
  },
});

// Set up http link
const httpLink = new HttpLink({
  uri: graphqlUrl,
  headers: {
    // authorization: `Bearer ${localStorage.getItem("token")}`,
    // "x-hasura-admin-secret": "myadminsecretkey3",
    // "x-hasura-default-role": "student",
  },
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

//log errors to the console
const logErrors = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

// Apollo
const client = new ApolloClient({
  link: ApolloLink.from([logErrors, authMiddleware, link]),
  cache,
});

export default client;
