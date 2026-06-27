import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import {router} from "./routes/router.jsx"
import { SessionProvider } from './components/sessionContextProvider'
const main =createRoot(document.getElementById('root')).render(
  <SessionProvider>
    <RouterProvider router={router}/>
  </SessionProvider>
  
)


export default main
