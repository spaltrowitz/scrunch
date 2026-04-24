import { HashRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './lib/auth'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { FeedbackButton } from './components/FeedbackButton'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { SignUp } from './pages/SignUp'
import { Onboarding } from './pages/Onboarding'
import { Dashboard } from './pages/Dashboard'
import { Products } from './pages/Products'
import { ProductDetail } from './pages/ProductDetail'
import { MyProducts } from './pages/MyProducts'
import { ProfilePage } from './pages/Profile'
import { IngredientCheckerPage } from './pages/IngredientCheckerPage'
import { Community } from './pages/Community'
import { About } from './pages/About'
import { Terms } from './pages/Terms'
import { Recommendations } from './pages/Recommendations'

const queryClient = new QueryClient()

function AppRoutes() {
  const { user, loading } = useAuth()
  if (loading) return null
  return (
    <Routes>
      <Route path="/" element={user ? <Dashboard /> : <Home />} />
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
