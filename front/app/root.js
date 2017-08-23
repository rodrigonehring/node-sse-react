import React from 'react'
import { Provider } from 'react-redux'

import configureStore from './configureStore'
import Routes from './routes'


export default class extends React.Component {
  render() {
    return (
      <Provider store={configureStore()}>
        <Routes />
      </Provider>
    )
  }
}
