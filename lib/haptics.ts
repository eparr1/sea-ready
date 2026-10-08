type CapacitorHaptics = {
  impact?: (opts: { style: "LIGHT" | "MEDIUM" | "HEAVY" }) => Promise<void>
  notification?: (opts: {
    type: "SUCCESS" | "WARNING" | "ERROR"
  }) => Promise<void>
}

function nativeHaptics(): CapacitorHaptics | undefined {
  if (typeof window === "undefined") return undefined
  const cap = (
    window as unknown as {
      Capacitor?: { Plugins?: { Haptics?: CapacitorHaptics } }
    }
  ).Capacitor
  return cap?.Plugins?.Haptics
}

function vibrate(ms: number) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator)
    navigator.vibrate(ms)
}

/** Light tap when an option is chosen. No-op where nothing is available. */
export function tapHaptic() {
  try {
    const native = nativeHaptics()
    if (native?.impact) void native.impact({ style: "LIGHT" })
    else vibrate(8)
  } catch {
    // Haptics are a nicety, never an error.
  }
}

/** Distinct feedback when an answer is revealed. */
export function resultHaptic(correct: boolean) {
  try {
    const native = nativeHaptics()
    if (native?.notification)
      void native.notification({ type: correct ? "SUCCESS" : "ERROR" })
    else vibrate(correct ? 12 : 30)
  } catch {
    // Haptics are a nicety, never an error.
  }
}
