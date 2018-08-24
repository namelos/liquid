import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import { withClientState } from 'apollo-link-state'
import { defaults, resolvers } from './resolvers'

export function configureClient() {
  const cache = new InMemoryCache()

  const stateLink = withClientState({ cache, defaults, resolvers })

  return new ApolloClient({
    link: ApolloLink.from([
      stateLink,
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.map(({ message, locations, path }) => {
            console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
          })
        }
        if (networkError) console.log(`[Network error]: ${networkError}`)
      })
    ]),
    cache: cache
  })
}

