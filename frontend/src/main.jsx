import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from "./components/ui/provider.jsx"
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
      <Provider>
        <App />
      </Provider>
    </BrowserRouter>
)
