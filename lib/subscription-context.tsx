'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  ErrorCode,
  Purchases,
  PurchasesError,
  type CustomerInfo,
  type Offering,
} from '@revenuecat/purchases-js'
import { useUser } from '@/lib/user-context'

export const PRO_ENTITLEMENT = 'master_mariner_pro_pro'

const API_KEY = process.env.NEXT_PUBLIC_REVENUECAT_API_KEY
const USER_ID_KEY = 'mmp-revenuecat-user-id'

type SubscriptionState = {
  isReady: boolean
  isPro: boolean
  customerInfo: CustomerInfo | null
  error: string | null
  /** Present the RevenueCat paywall for the current offering. Resolves true if the user is now Pro. */
  presentPaywall: (offering?: Offering) => Promise<boolean>
  refresh: () => Promise<void>
  /** Stripe-hosted portal where the customer can cancel / update payment. Null until they have purchased. */
  managementURL: string | null
}

const SubscriptionContext = createContext<SubscriptionState>({
  isReady: false,
  isPro: false,
  customerInfo: null,
  error: null,
  presentPaywall: async () => false,
  refresh: async () => {},
  managementURL: null,
})

// Anonymous id persisted so purchases survive reloads until real auth exists.
// When login is added, call Purchases.getSharedInstance().changeUser(userId).
function getAppUserId(): string {
  try {
    const existing = localStorage.getItem(USER_ID_KEY)
    if (existing) return existing
    const id = Purchases.generateRevenueCatAnonymousAppUserId()
    localStorage.setItem(USER_ID_KEY, id)
    return id
  } catch {
    return Purchases.generateRevenueCatAnonymousAppUserId()
  }
}

const hasPro = (info: CustomerInfo) =>
  PRO_ENTITLEMENT in info.entitlements.active

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const user = useUser()
  const [isReady, setIsReady] = useState(false)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!Purchases.isConfigured()) return
    try {
      setCustomerInfo(await Purchases.getSharedInstance().getCustomerInfo())
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load subscription')
    }
  }, [])

  useEffect(() => {
    if (!API_KEY) {
      setError('NEXT_PUBLIC_REVENUECAT_API_KEY is not set')
      return
    }
    const appUserId = user.isLoggedIn ? user.id : getAppUserId()
    if (!Purchases.isConfigured()) {
      try {
        Purchases.configure({ apiKey: API_KEY, appUserId })
      } catch (e) {
        setError(e instanceof Error ? e.message : 'RevenueCat failed to start')
        return
      }
    }
    const purchases = Purchases.getSharedInstance()
    // Link purchases to the signed-in account (no-op if already that user).
    // Signed out: switch back to the anonymous id so the old account's Pro doesn't linger.
    const wantedId = user.isLoggedIn ? user.id : appUserId
    const identify =
      purchases.getAppUserId() !== wantedId
        ? purchases.changeUser(wantedId).then(setCustomerInfo)
        : Promise.resolve()
    identify.then(refresh).catch((e) => {
      setError(e instanceof Error ? e.message : 'Could not identify user')
    }).finally(() => setIsReady(true))
  }, [refresh, user.isLoggedIn, user.id])

  const presentPaywall = useCallback(
    async (offering?: Offering) => {
      if (!Purchases.isConfigured()) return false
      try {
        const purchases = Purchases.getSharedInstance()
        const { customerInfo: info } = await purchases.presentPaywall({
          offering,
          customerEmail: undefined,
        })
        setCustomerInfo(info)
        return hasPro(info)
      } catch (e) {
        // Closing the paywall / cancelling checkout is not an error.
        if (e instanceof PurchasesError && e.errorCode === ErrorCode.UserCancelledError) {
          return false
        }
        setError(e instanceof Error ? e.message : 'Purchase failed')
        return false
      }
    },
    [],
  )

  const value = useMemo<SubscriptionState>(
    () => ({
      isReady,
      isPro: customerInfo ? hasPro(customerInfo) : false,
      customerInfo,
      error,
      presentPaywall,
      refresh,
      managementURL: customerInfo?.managementURL ?? null,
    }),
    [isReady, customerInfo, error, presentPaywall, refresh],
  )

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription(): SubscriptionState {
  return useContext(SubscriptionContext)
}
