import { reduceQuery } from './utils'

export const defaults = {
  n: 1,
  todos: [{
    text: 'my first todo',
    __typename: 'Todo'
  }, {
    text: 'my second todo',
    __typename: 'Todo'
  }]
}

const nQuery = '{ n }'

export const resolvers = {
  Mutation: {
    increment: reduceQuery(nQuery, ({ n }) => ({ n: n + 1 })),
    decrement: reduceQuery(nQuery, ({ n }) => ({ n: n - 1 })),
  }
}
