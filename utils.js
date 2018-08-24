import React from 'react'
import { Mutation, Query } from 'react-apollo'
import { compose } from 'redux'
import gql from 'graphql-tag'

export const reduceQuery = (q, f) => (_, args, { cache }) => {
  const query = gql(q)
  const data = f(cache.readQuery({ query }), args)
  cache.writeQuery({ query, data })
  return data
}

const queryQl = query => Comp => props => {
  return <Query query={gql(query)}>
    {({ loading, error, data }) => {
      if (loading) return <p>loading</p>
      if (error) return <p>error</p>
      return <Comp {...props} {...data} />
    }}
  </Query>
}

const applyVar = mutationFn => args =>
  mutationFn({ variables: args })

const mutationQl = (key, mutation) => Comp => props => {
  return <Mutation mutation={gql(mutation)}>
    {mutationFn => <Comp {...props} {...{[key]: applyVar(mutationFn)}} />}
  </Mutation>;
}

const mutationsQl = mutations => compose(
  ...Object.entries(mutations || {})
  .map(([key, mutation]) => mutationQl(key, mutation))
)

export const ql = (query, mutations) => compose(
  queryQl(query),
  mutationsQl(mutations)
)
