import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'
import './index.css'
import {store} from './redux/store.js'
import {Provider as ReduxProvider} from 'react-redux'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ReduxProvider store={store} >
    <App />
    </ReduxProvider>
  </React.StrictMode>,
)
