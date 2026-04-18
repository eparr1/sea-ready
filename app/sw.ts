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
      // Cache questions.json with NetworkFirst — serves from cache when offline.
      // The quiz page reads this directly, so any topic can be filtered offline.
      matcher: ({ url }) => url.pathname === '/questions.json',
      handler: new NetworkFirst({
        cacheName: 'questions-json',
        networkTimeoutSeconds: 5,
      }),
    },
    ...defaultCache,
  ],
})

serwist.addEventListeners()
