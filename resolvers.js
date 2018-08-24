import { reduceQuery, createType } from './utils'

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
