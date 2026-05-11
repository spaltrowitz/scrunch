import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './lib/auth'
import { useAuth } from './lib/auth.utils'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ToastProvider } from './hooks/useToast'
import { ToastContainer } from './components/ui/ToastContainer'
import { usePageTitle } from './hooks/usePageTitle'
import { useMigrateLocalRatings } from './hooks/useMigrateLocalRatings'
import { useAnalytics } from './hooks/useAnalytics'

const PAGE_PLACEHOLDER = <div className="flex-1 animate-pulse bg-gray-50" />

function PageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-7 w-48 bg-gray-200 rounded mb-3" />
      <div className="h-4 w-72 bg-gray-100 rounded mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 bg-white border border-gray-200 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })))
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })))
const SignUp = lazy(() => import('./pages/SignUp').then(m => ({ default: m.SignUp })))
const Onboarding = lazy(() => import('./pages/Onboarding').then(m => ({ default: m.Onboarding })))
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })))
const Products = lazy(() => import('./pages/Products').then(m => ({ default: m.Products })))
const ProductDetail = lazy(() => import('./pages/ProductDetail').then(m => ({ default: m.ProductDetail })))
const MyProducts = lazy(() => import('./pages/MyProducts').then(m => ({ default: m.MyProducts })))
const ProfilePage = lazy(() => import('./pages/Profile').then(m => ({ default: m.ProfilePage })))
const IngredientCheckerPage = lazy(() => import('./pages/IngredientCheckerPage').then(m => ({ default: m.IngredientCheckerPage })))
const Community = lazy(() => import('./pages/Community').then(m => ({ default: m.Community })))
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })))
const Terms = lazy(() => import('./pages/Terms').then(m => ({ default: m.Terms })))
const Privacy = lazy(() => import('./pages/Privacy').then(m => ({ default: m.Privacy })))
const Recommendations = lazy(() => import('./pages/Recommendations').then(m => ({ default: m.Recommendations })))
const CategoryPage = lazy(() => import('./pages/CategoryPage').then(m => ({ default: m.CategoryPage })))
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
})

function PageTitleUpdater() {
  usePageTitle()
  return null
}

function MigrationRunner() {
  useMigrateLocalRatings()
  return null
}

function AnalyticsRunner() {
  useAnalytics()
  return null
}

function AppRoutes() {
  const { loading } = useAuth()
  if (loading) return PAGE_PLACEHOLDER
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageTitleUpdater />
      <MigrationRunner />
      <AnalyticsRunner />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/my-products" element={<MyProducts />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/ingredient-checker" element={<IngredientCheckerPage />} />
        <Route path="/community" element={<Community />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <HashRouter>
            <div className="min-h-screen flex flex-col bg-gray-50">
              <Header />
              <main className="flex-1">
                <ErrorBoundary>
                  <AppRoutes />
                </ErrorBoundary>
              </main>
              <Footer />
              <ToastContainer />
            </div>
          </HashRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
