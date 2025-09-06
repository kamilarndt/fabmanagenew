import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { ConfigProvider, App as AntdApp, theme as antdTheme } from 'antd'
import ErrorBoundary from './components/ErrorBoundary'
import { initSentry } from './lib/sentry'
import './index.css'
import 'antd/dist/reset.css'

initSentry()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={{
      algorithm: antdTheme.defaultAlgorithm,
      token: {
        colorPrimary: '#1677ff',
        borderRadius: 6
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
