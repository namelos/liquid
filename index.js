import React from 'react'
import { render } from 'react-dom'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import { withClientState } from 'apollo-link-state'
import { Query, Mutation, ApolloProvider } from 'react-apollo'
import gql from 'graphql-tag'

const cache = new InMemoryCache()

const query = gql`
  query {
    n @client
  }
`

const stateLink = withClientState({
  cache,
  defaults: {
    n: 1
  },
  resolvers: {
    Mutation: {
      increment: (_, __,  { cache }) => {
        const { n } = cache.readQuery({ query })
        const data = { n: n + 1 }
        cache.writeQuery({ query, data })
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

const mutation = gql`
  mutation Increment {
    increment @client
  }
`

const ql = query => Comp => props => {
  return <Query query={query}>
    {({ loading, error, data }) => {
      if (loading) return <p>loading</p>
      if (error) return <p>error</p>

      return <Comp {...props} {...data} />
    }}
  </Query>
}

const Counter = ql(query)
(({ n }) => <Mutation mutation={mutation}>
  {increment => <p onClick={increment}>{n}</p>}
</Mutation>)

const App = () => <ApolloProvider client={client}>
  <Counter/>
</ApolloProvider>

render(<App/>, document.querySelector('#app'))
