import {ApolloClient, InMemoryCache, split, createHttpLink, type NormalizedCacheObject} from "@apollo/client";
import {getMainDefinition} from "@apollo/client/utilities";
import {setContext} from "@apollo/client/link/context";
import {GraphQLWsLink} from "@apollo/client/link/subscriptions";
import {createClient} from "graphql-ws";

export type AppApolloClients = {
  talisApolloClient: ApolloClient<NormalizedCacheObject>;
  nomosApolloClient: ApolloClient<NormalizedCacheObject>;
};

const NOMOS_GRAPHQL_JWT = process.env.NEXT_PUBLIC_HASURA_JWT_CONSTANTINE_3;
const NOMOS_GRAPHQL_ENDPOINT = "https://testnet-fallback.hasura.app/v1/graphql";
const TALIS_GRAPHQL_ENDPOINT = "https://injective.talis.art/api/graphql";

const getApolloClient = (httpURI: string, jwt?: string): ApolloClient<NormalizedCacheObject> => {
  const httpLink = createHttpLink({
    uri: httpURI,
  });

  //const wsLink = new GraphQLWsLink(
  //createClient({
  //url: httpURI.replace("https", "wss"),
  //connectionParams: jwt ? () => {
  //return {
  //headers: {
  //Authorization: `Bearer ${jwt}`,
  //},
  //};
  //} : undefined,
  //})
  //);

  //const authLink = jwt ? setContext((_, {headers}) => {
  //return {
  //headers: {
  //...headers,
  //Authorization: `Bearer ${jwt}`,
  //},
  //};
  //}) : null;

  //const splitLink = split(
  //({query}) => {
  //const definition = getMainDefinition(query);
  //return definition.kind === "OperationDefinition" && definition.operation === "subscription";
  //},
  //wsLink,
  //authLink?.concat(httpLink) ?? httpLink,
  //);

  const client = new ApolloClient({
    //link: splitLink,
    link: httpLink,
    cache: new InMemoryCache(),
  });

  return client;
  return null;
}

const apolloClients: AppApolloClients = {
  talisApolloClient: getApolloClient(TALIS_GRAPHQL_ENDPOINT),
  nomosApolloClient: getApolloClient(NOMOS_GRAPHQL_ENDPOINT, NOMOS_GRAPHQL_JWT),
};

export default apolloClients;
