import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import routes from './MainRoute'
import { ThemeProvider } from './components/theme-provider'
import { ApiUrl } from './lib/variable'

console.log("API URL being used:", ApiUrl);

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <RouterProvider router={routes} />
  </ThemeProvider>,
)
