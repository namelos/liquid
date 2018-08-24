import React from 'react'
import { render } from 'react-dom'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import { withClientState } from 'apollo-link-state'
import { ApolloProvider, Mutation, Query } from 'react-apollo'
import { compose } from 'redux'
import gql from 'graphql-tag'

const cache = new InMemoryCache()

const reduceQuery = (q, f) => (_, args, { cache }) => {
  const query = gql(q)
  const data = f(cache.readQuery({ query }))
  cache.writeQuery({ query, data })
  return data
}

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

const queryQl = query => Comp => props => {
  return <Query query={gql(query)}>
    {({ loading, error, data }) => {
      if (loading) return <p>loading</p>
      if (error) return <p>error</p>
      return <Comp {...props} {...data} />
    }}
  </Query>
}

const mutationQl = (key, mutation) => Comp => props => {
  return <Mutation mutation={gql(mutation)}>
    {mutationFn => <Comp {...props} {...{[key]: mutationFn}} />}
  </Mutation>;
}

const mutationsQl = mutations => compose(
  ...Object.entries(mutations)
  .map(([key, mutation]) => mutationQl(key, mutation))
)

const Counter = compose(
  queryQl('query { n }'),
  mutationsQl({
    decrement: 'mutation { decrement @client }',
    increment: 'mutation { increment @client }'
  })
)(({ n, increment, decrement }) => <div>
  <p>{n}</p>
  <button onClick={increment}>+</button>
  <button onClick={decrement}>-</button>
</div>)

const App = () => <ApolloProvider client={client}>
  <Counter/>
</ApolloProvider>

render(<App/>, document.querySelector('#app'))
