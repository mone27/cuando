import React from 'react'
import { render } from 'react-dom'

import App from './App'
import './main.css'

let link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('href', 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap');
document.head.appendChild(link);

document.addEventListener('DOMContentLoaded', function() {
  render(<App/>,
    document.body.appendChild(document.createElement('div'))
  )
})

