import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import AppWrapper from './appWrapper'
import Home from './home'


export default class extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <AppWrapper>
          <Route exact path="/" component={Home} />
        </AppWrapper>
      </BrowserRouter>
    )
  }
}
