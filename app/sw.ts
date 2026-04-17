import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'
import { Serwist, NetworkFirst } from 'serwist'
import { defaultCache } from '@serwist/next/worker'

declare global {
  interface ServiceWorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      // Cache the questions API with NetworkFirst — serves from cache when offline
      matcher: ({ url }) => url.pathname === '/api/questions',
      handler: new NetworkFirst({
        cacheName: 'api-questions',
        networkTimeoutSeconds: 5,
      }),
    },
    ...defaultCache,
  ],
})

serwist.addEventListeners()
