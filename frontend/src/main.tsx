import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import { registerSW } from 'virtual:pwa-register'
import App from './App.tsx'
import { errorMessage } from './lib/errors'
import { useUiStore } from './store/ui.store'

// Remove the legacy cache of private API responses.
if ('caches' in window) void caches.delete('api-cache').catch(() => {});

// Register PWA Service Worker
registerSW({ immediate: true })

const queryClient = new QueryClient({
  mutationCache: new MutationCache({ onError: (error) => useUiStore.getState().setNotification({ type: 'error', message: errorMessage(error) }) }),

  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
