import { ApolloClient, InMemoryCache } from "@apollo/client";

const GQL_URI = "https://dummyapi.io/data/graphql";

const appId = process.env.REACT_APP_APP_ID || "";

export const client = new ApolloClient({
  uri: GQL_URI,
  cache: new InMemoryCache(),
  headers: {
    "app-id": appId,
  },
});
