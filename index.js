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

const stateLink = withClientState({
  cache,
  defaults: {
    n: 1
  },
  resolvers: {
    Mutation: {
      increment: (_, __,  { cache }) => {
        const { n } = cache.readQuery({ query: gql`
  query {
    n @client
  }
` })
        const data = { n: n + 1 }
        cache.writeQuery({ query: gql`
  query {
    n @client
  }
`, data })
        return data
      }
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

const ql = (query, mutations) => Comp => props => {
  const [key, mutation] = Object.entries(mutations)[0]

  return <Query query={gql(query)}>
    {({ loading, error, data }) => {
      if (loading) return <p>loading</p>
      if (error) return <p>error</p>

      return <Mutation mutation={gql(mutation)}>
        {mutationFn => <Comp {...props} {...data} {...{[key]: mutationFn}} />}
      </Mutation>
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
