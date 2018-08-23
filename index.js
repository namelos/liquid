import React from 'react'
import { render } from 'react-dom'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import { withClientState } from 'apollo-link-state'
import { ApolloProvider, Mutation, Query } from 'react-apollo'
import gql from 'graphql-tag'

const cache = new InMemoryCache()

const reduceQuery = (q, f) => (_, args, { cache }) => {
  const query = gql(q)
  const data = f(cache.readQuery({ query }))
  cache.writeQuery({ query, data })
  return data
}

const increment = reduceQuery('query { n }', ({ n }) => ({ n: n + 1 }))

const stateLink = withClientState({
  cache,
  defaults: { n: 1 },
  resolvers: {
    Mutation: { increment }
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

const ql = (query, mutations) => Comp => props => {
  return <Query query={gql(query)}>
    {({ loading, error, data }) => {
      if (loading) return <p>loading</p>
      if (error) return <p>error</p>

      return Object.entries(mutations)
      .reduce((acc, [key, mutation]) => <Mutation mutation={gql(mutation)}>
        {mutationFn => React.cloneElement(acc, { [key]: mutationFn })}
      </Mutation>, <Comp {...props} {...data} />)
    }}
  </Query>
}

const Counter = ql('query { n }', {
  increment: 'mutation { increment @client }'
})(({ n, increment }) => <p onClick={increment}>{n}</p>)

const App = () => <ApolloProvider client={client}>
  <Counter/>
</ApolloProvider>

render(<App/>, document.querySelector('#app'))
