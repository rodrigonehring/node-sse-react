import React from 'react'
import { Provider } from 'react-redux'

import configureStore from './configureStore'


export default class extends React.Component {
  render() {
    return (
      <Provider store={configureStore()}>
        <div>
          olar
        </div>
      </Provider>
    )
  }
}
