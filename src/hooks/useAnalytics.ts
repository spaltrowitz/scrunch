import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../lib/analytics'

export function useAnalytics() {
  const location = useLocation()
  const lastPath = useRef('')

  useEffect(() => {
    const path = location.pathname
    if (path !== lastPath.current) {
      lastPath.current = path
      trackPageView(path)
    }
  }, [location])
}
