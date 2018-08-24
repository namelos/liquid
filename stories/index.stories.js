import React from 'react'
import { storiesOf } from '@storybook/react'
import { Counter } from '../components/Counter'
import { configureClient } from '../client'
import { ApolloProvider } from 'react-apollo'

const Provider = ({ children }) => <ApolloProvider client={configureClient()}>
  {children}
</ApolloProvider>

storiesOf('Main', module)
  .addDecorator(story => <Provider>{story()}</Provider>)
  .add('counter', () => <Counter/>)
