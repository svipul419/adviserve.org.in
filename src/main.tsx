import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.tsx'
import './index.css'

// Force the white surface theme.
// Previously this lived as an inline <script> in index.html, but the strict
// CSP in vercel.json blocks inline scripts — moving it into the bundled
// entrypoint keeps the bootstrap working without weakening script-src.
try {
  document.documentElement.classList.remove('dark');
  document.documentElement.classList.add('light');
  document.documentElement.style.colorScheme = 'light';
  localStorage.setItem('adviserve-theme', 'light');
} catch { /* ignore (privacy mode / storage disabled) */ }

// ErrorBoundary is mounted inside App for public/admin routes so each route
// tree can recover independently — no outer boundary here. See App.tsx.

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <App />
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
