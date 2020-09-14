import React from 'react'
import { render } from 'react-dom'

import App from './App'
import './main.css'


document.addEventListener('DOMContentLoaded', function() {
  render(
      <App/>,
    document.body.appendChild(document.createElement('div'))
  )
})

