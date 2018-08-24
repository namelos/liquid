import React from 'react'
import { ql } from '../utils'

export const Todos = ql('{ todos { text } }', {
  addTodo: `mutation {
    addTodo(text: $text) @client 
  }`
})(function Todos({ todos, addTodo }) {
  return <div>
    <TodoList todos={todos} />
    <AddTodo addTodo={addTodo} />
  </div>
})

function TodoList({ todos }) {
  return <ul>
    {todos.map((todo, i) => <TodoItem {...todo} key={i} />)}
  </ul>
}

function TodoItem({ text }) {
  return <li>{text}</li>
}

function AddTodo({ addTodo }) {
  return <div>
    <input type="text" />
    <button onClick={() => addTodo({ variables: { text: 'new todo!'}})}>add</button>
  </div>
}
