import React from 'react'
import { storiesOf } from '@storybook/react'
import { Counter } from '../components/Counter'
import { Todos } from '../components/Todos'
import { configureClient } from '../client'
import { ApolloProvider } from 'react-apollo'

const Provider = ({ children }) => <ApolloProvider client={configureClient()}>
  {children}
</ApolloProvider>

storiesOf('Main', module)
  .addDecorator(story => <Provider>{story()}</Provider>)
  .add('counter', () => <Counter/>)
  .add('todo', () => <Todos/>)
