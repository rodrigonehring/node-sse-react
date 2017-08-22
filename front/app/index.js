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

// ================================
// DELETE
// ================================

const sourceAll = new EventSource('/sse/all')
const usersTotal = document.querySelector('#total span')

sourceAll.onmessage = function(e) {
  const data = JSON.parse(e.data)

  if (data.event === 'user_connection') {
    usersTotal.innerHTML = data.data.total
  }
}
