import { reduceQuery } from './utils'

const createType = (name, ctor) => args => {
  const data = ctor(args)
  return Object.assign(data, {__typename: name})
}

const Todo = createType('Todo', ({ text }) => ({ text }))

export const defaults = {
  n: 1,
  todos: []
}

const nQuery = '{ n }'
const todoQuery = '{ todos { text } }'

export const resolvers = {
  Mutation: {
    increment: reduceQuery(nQuery, ({ n }) => ({ n: n + 1 })),
    decrement: reduceQuery(nQuery, ({ n }) => ({ n: n - 1 })),
    addTodo: reduceQuery(todoQuery, ({ todos }, { text }) =>
      ({ todos: [...todos, Todo({ text })] }))
  }
}
