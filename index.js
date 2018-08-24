import React from 'react'
import { render } from 'react-dom'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import { withClientState } from 'apollo-link-state'
import { ApolloProvider } from 'react-apollo'

import { ql, reduceQuery } from './utils'

const cache = new InMemoryCache()

const stateLink = withClientState({
  cache,
  defaults: { n: 1 },
  resolvers: {
    Mutation: {
      increment: reduceQuery('query { n }', ({ n }) => ({ n: n + 1 })),
      decrement: reduceQuery('query { n }', ({ n }) => ({ n: n - 1 })),
    }
  }
})

const client = new ApolloClient({
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

const Counter = ql('query { n }', {
  decrement: 'mutation { decrement @client }',
  increment: 'mutation { increment @client }'
})(({ n, increment, decrement }) => <div>
  <p>{n}</p>
  <button onClick={increment}>+</button>
  <button onClick={decrement}>-</button>
</div>)

const App = () => <ApolloProvider client={client}>
  <Counter/>
</ApolloProvider>

render(<App/>, document.querySelector('#app'))
