import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, theme } from "antd";
import React, { Suspense } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Materials = React.lazy(() => import("./pages/SimpleMaterials"));
const Tiles = React.lazy(() => import("./pages/Tiles"));
const Pricing = React.lazy(() => import("./pages/Pricing"));
const Logistics = React.lazy(() => import("./pages/Logistics"));
const Accommodation = React.lazy(() => import("./pages/Accommodation"));
const Files = React.lazy(() => import("./pages/Files"));
const Concepts = React.lazy(() => import("./pages/Concepts"));
const Documents = React.lazy(() => import("./pages/Documents"));
const Messaging = React.lazy(() => import("./pages/Messaging"));

// Layout components
import { LoadingSpinner } from "./components/Common/LoadingSpinner";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import { Layout } from "./components/Layout/Layout";

// Performance monitoring
import { PerformanceMonitor } from "./components/Performance/PerformanceMonitor";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            algorithm: theme.defaultAlgorithm,
            token: {
              colorPrimary: "#1677ff",
              borderRadius: 6,
            },
          }}
        >
          <Router>
            <Layout>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Default route - Main Dashboard */}
                  <Route path="/" element={<Dashboard />} />

                  {/* Module routes */}
                  <Route path="/materials" element={<Materials />} />
                  <Route path="/tiles" element={<Tiles />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/logistics" element={<Logistics />} />
                  <Route path="/accommodation" element={<Accommodation />} />
                  <Route path="/files" element={<Files />} />
                  <Route path="/concepts" element={<Concepts />} />
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/messaging" element={<Messaging />} />

                  {/* 404 route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </Layout>
          </Router>

          {/* Performance monitoring */}
          <PerformanceMonitor />

          {/* React Query DevTools (only in development) */}
          {/* {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )} */}
        </ConfigProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
