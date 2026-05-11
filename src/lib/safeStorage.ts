/**
 * Storage helpers that never throw. Browsers can throw on localStorage.setItem
 * in three common cases:
 *   1. Safari Private Mode (quota = 0)
 *   2. Disk full / quota exceeded
 *   3. localStorage entirely disabled (rare, but third-party iframes etc.)
 *
 * Functionality degrades to "this write didn't persist" rather than crashing
 * the click handler that called us.
 */

export function safeLocalSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // intentional: persistence best-effort
  }
}

export function safeLocalRemove(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    // intentional
  }
}

export function safeLocalGet(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}
