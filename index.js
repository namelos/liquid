import React from 'react'
import { render } from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { configureClient } from './client'
import { Counter } from './components/Counter'

const client = configureClient()

const App = () => <ApolloProvider client={client}>
  <Counter/>
</ApolloProvider>

render(<App/>, document.querySelector('#app'))
