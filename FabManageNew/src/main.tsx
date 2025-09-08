import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { ConfigProvider, App as AntdApp, theme as antdTheme } from 'antd'
import ErrorBoundary from './components/ErrorBoundary'
import { initSentry } from './lib/sentry'
import './index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'antd/dist/reset.css'

// Dev-only: ensure no stale service workers interfere with module loading
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      registration.unregister().catch(() => { })
    }
  }).catch(() => { })
}

initSentry()
// Ensure a consistent default theme before app render
const savedTheme = (localStorage.getItem('theme') as string) || 'dark-green'
const savedSkin = (localStorage.getItem('skin') as string) || 'default'
document.documentElement.setAttribute('data-theme', savedTheme)
document.documentElement.setAttribute('data-skin', savedSkin)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={{
      algorithm: antdTheme.darkAlgorithm,
      token: {
        colorPrimary: 'var(--primary-main)',
        colorLink: 'var(--primary-main)',
        colorBgBase: 'var(--bg-primary)',
        colorBgContainer: 'var(--bg-surface)',
        colorText: 'var(--text-primary)',
        colorTextSecondary: 'var(--text-secondary)',
        colorTextTertiary: 'var(--text-muted)',
        colorBorder: 'var(--border-medium)',
        colorSuccess: 'var(--accent-success)',
        colorWarning: 'var(--accent-warning)',
        colorError: 'var(--accent-error)',
        colorInfo: 'var(--accent-info)',
        borderRadius: 0,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
      },
      components: {
        Button: { borderRadius: 0 },
        Card: { borderRadius: 0, headerBg: 'var(--bg-secondary)' as any },
        Input: { borderRadius: 0 },
        Select: { borderRadius: 0 },
        Tag: { borderRadius: 0 },
        Layout: { headerBg: 'var(--bg-secondary)' as any, siderBg: 'var(--bg-secondary)' as any }
      }
    }}>
      <AntdApp>
        <BrowserRouter>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  </StrictMode>,
)
