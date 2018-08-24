import React from 'react'
import { render } from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { configureClient } from './client'
import { Todos } from './components/Todos'

const client = configureClient()

const App = () => <ApolloProvider client={client}>
  <Todos />
</ApolloProvider>

render(<App/>, document.querySelector('#app'))
