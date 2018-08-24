import React from 'react'
import { ql } from '../utils'

export const Todos = ql('{ todos { text } }')
(function Todos({ todos }) {
  return <div>
    <TodoList todos={todos} />
    <AddTodo />
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

function AddTodo() {
  return <div>
    <input type="text" />
    <button>add</button>
  </div>
}
