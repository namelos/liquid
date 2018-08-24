import { reduceQuery } from './utils'

const createType = (name, ctor) => args => {
  const data = ctor(args)
  return Object.assign(data, {__typename: name})
}

const Todo = createType('Todo', ({ text }) => ({ text }))

export const defaults = {
  n: 1,
  todos: [
    Todo({ text: 'my first todo' }),
    Todo({ text: 'my second todo' })
  ]
}

const nQuery = '{ n }'

export const resolvers = {
  Mutation: {
    increment: reduceQuery(nQuery, ({ n }) => ({ n: n + 1 })),
    decrement: reduceQuery(nQuery, ({ n }) => ({ n: n - 1 })),
  }
}
