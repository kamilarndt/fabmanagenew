import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App as AntdApp } from "antd";
import "antd/dist/reset.css";
import { StrictMode } from "react";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import { AppWithSkipLinks } from "./components/ui/SkipLink";
import "./i18n";
import "./index.css";
import { initSentry } from "./lib/sentry";

// Konfiguracja React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 30000, // 30 sekund
    },
  },
});

// Dev-only: ensure no stale service workers interfere with module loading
if (import.meta.env.DEV && "serviceWorker" in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().catch(() => {});
      }
    })
    .catch(() => {});
}

initSentry();
// Initialize Dark Mode Tech theme
// initial attribute will be managed by ThemeProvider

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AntdApp>
          <BrowserRouter>
            <ErrorBoundary>
              <AppWithSkipLinks>
                <App />
              </AppWithSkipLinks>
            </ErrorBoundary>
          </BrowserRouter>
        </AntdApp>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
