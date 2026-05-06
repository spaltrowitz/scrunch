import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Scrunch  -  Curly Hair Product Discovery',
  '/products': 'Browse Curly Hair Products | Scrunch',
  '/community': 'Curly Hair Community Q&A | Scrunch',
  '/about': 'About Scrunch',
  '/terms': 'Terms of Use | Scrunch',
  '/ingredient-checker': 'Ingredient Checker  -  Is It CG Approved? | Scrunch',
  '/recommendations': 'Personalized Product Recommendations | Scrunch',
  '/login': 'Log In | Scrunch',
  '/signup': 'Sign Up | Scrunch',
  '/onboarding': 'Hair Profile Setup | Scrunch',
  '/dashboard': 'Dashboard | Scrunch',
  '/my-products': 'My Products | Scrunch',
  '/profile': 'Profile | Scrunch',
}

export function usePageTitle(override?: string) {
  const { pathname } = useLocation()

  useEffect(() => {
    const defaultTitle = 'Scrunch  -  Curly Hair Product Discovery'
    if (override) {
      document.title = override
    } else {
      document.title = ROUTE_TITLES[pathname] ?? defaultTitle
    }
    return () => { document.title = defaultTitle }
  }, [pathname, override])
}
