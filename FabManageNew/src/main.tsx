import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { ConfigProvider, App as AntdApp, theme } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { darkTechTheme } from './styles/ant-design-theme'
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary'
import { initSentry } from './lib/sentry'
import './index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'antd/dist/reset.css'

// Konfiguracja React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 30000, // 30 sekund
    },
  },
})

// Dev-only: ensure no stale service workers interfere with module loading
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      registration.unregister().catch(() => { })
    }
  }).catch(() => { })
}

initSentry()
// Initialize Dark Mode Tech theme
document.documentElement.setAttribute('data-theme', 'dark-tech')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={{
        ...darkTechTheme,
        algorithm: theme.darkAlgorithm
      }}>
        <AntdApp>
          <BrowserRouter>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </BrowserRouter>
        </AntdApp>
      </ConfigProvider>
    </QueryClientProvider>
  </StrictMode>,
)
