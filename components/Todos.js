import React from 'react'
import { ql } from '../utils'

export const Todos = ql('{ todos { text } }', {
  addTodo: `mutation { addTodo(text: $text) @client }`
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
  let input
  return <div>
    <input type="text" ref={r => input = r} />
    <button onClick={() => addTodo({ text: input.value })}>add</button>
  </div>
}
