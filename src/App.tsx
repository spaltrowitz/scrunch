import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './lib/auth'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { FeedbackButton } from './components/FeedbackButton'

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
const Recommendations = lazy(() => import('./pages/Recommendations').then(m => ({ default: m.Recommendations })))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
})

function AppRoutes() {
  const { loading } = useAuth()
  if (loading) return null
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20 text-gray-400">Loading…</div>}>
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
      </Routes>
    </Suspense>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <HashRouter>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1">
              <AppRoutes />
            </main>
            <Footer />
            <FeedbackButton />
          </div>
        </HashRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
