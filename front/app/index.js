/**
 * Application entry point
 */
import React from 'react'
import ReactDom from 'react-dom'
import Root from './root'


// Load application styles
import 'styles/index.scss'

// ================================
// START YOUR APP HERE
// ================================


ReactDom.render(
  <Root />,
  document.querySelector('#root')
)


// to help plan a night out with friends, crowdsourcing the date/time and choice of bar/restaurant
