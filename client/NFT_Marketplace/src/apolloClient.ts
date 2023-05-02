import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'

const httpLink = createHttpLink({
  uri: 'https://api.studio.thegraph.com/query/45812/nft-marketplace-2/v0.0.2',
})

const cache = new InMemoryCache()

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})

