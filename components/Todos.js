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

  function handleClick(e) {
    e.preventDefault()
    if (!input.value) return
    addTodo({ text: input.value })
    input.value = ''
  }

  return <div>
    <input type="text" ref={r => input = r} />
    <button onClick={handleClick}>add</button>
  </div>
}
