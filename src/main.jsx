import React from 'react'
import { render } from 'react-dom'

import DemoApp from './DemoApp'
import './main.css'


document.addEventListener('DOMContentLoaded', function() {
  render(
      <DemoApp
      events={[]}/>,
    document.body.appendChild(document.createElement('div'))
  )
})
