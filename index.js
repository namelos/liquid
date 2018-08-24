import React from 'react'
import { render } from 'react-dom'
import { ApolloProvider } from 'react-apollo'

import { ql } from './utils'
import { configureClient } from './client'

const client = configureClient()

const Counter = ql('query { n }', {
  decrement: 'mutation { decrement @client }',
  increment: 'mutation { increment @client }'
})(({ n, increment, decrement }) => <div>
  <p>{n}</p>
  <button onClick={increment}>+</button>
  <button onClick={decrement}>-</button>
</div>)

const App = () => <ApolloProvider client={client}>
  <Counter/>
</ApolloProvider>

render(<App/>, document.querySelector('#app'))
