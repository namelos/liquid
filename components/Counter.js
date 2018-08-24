import React from 'react'
import { ql } from '../utils'

export const Counter = ql('query { n }', {
  decrement: 'mutation { decrement @client }',
  increment: 'mutation { increment @client }'
})(({ n, increment, decrement }) => <div>
  <p>{n}</p>
  <button onClick={increment}>+</button>
  <button onClick={decrement}>-</button>
</div>)
