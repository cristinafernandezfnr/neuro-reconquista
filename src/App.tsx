import React, { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { canAccessProtocol, isBanned } from './lib/access'
import { getNextDemoRoute } from './lib/demoFlow'
import { AppLayout } from './components/layout/AppLayout'
import { isCoachEnabled } from './lib/coachFlag'

// Lazy load all pages
const Auth = lazy(() => import('./pages/Auth'))
const Onboarding = lazy(() => import('./pages/Onboarding'))
const Anamnese = lazy(() => import('./pages/Anamnese'))
const Home = lazy(() => import('./pages/Home'))
const Tasks = lazy(() => import('./pages/Tasks'))
const Progress = lazy(() => import('./pages/Progress'))
const Modules = lazy(() => import('./pages/Modules'))
const Coach = lazy(() => import('./pages/Coach'))
const SOS = lazy(() => import('./pages/SOS'))
const Profile = lazy(() => import('./pages/Profile'))
const Admin = lazy(() => import('./pages/Admin'))

const Spinner = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
)

// Root redirect: unauthenticated → /auth, authenticated → flow route
const RootRedirect: React.FC = () => {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  if (!user) return <Navigate to="/auth" replace />
  return <Navigate to={getNextDemoRoute()} replace />
}

// Auth page redirect: if already logged in, skip to correct step
const AuthRoute: React.FC = () => {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  if (user) return <Navigate to={getNextDemoRoute()} replace />
  return <Auth />
}

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  if (!user) return <Navigate to="/auth" replace />
  if (isBanned(user)) return <BannedScreen />
  return <>{children}</>
}

const ProtocolRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  if (!user) return <Navigate to="/auth" replace />
  if (!canAccessProtocol(user)) return <NoAccessScreen />
  return <>{children}</>
}

const BannedScreen = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
    <p className="text-4xl mb-4">🚫</p>
    <h1 className="font-display text-2xl font-bold text-text-primary mb-2">Acesso Suspenso</h1>
    <p className="text-text-secondary text-sm">Seu acesso foi suspenso. Para reativar, entre em contato com o suporte.</p>
  </div>
)

const NoAccessScreen = () => (
  <AppLayout>
    <div className="flex flex-col items-center justify-center h-64 text-center px-4">
      <p className="text-4xl mb-4">🔒</p>
      <h1 className="font-display text-xl font-bold text-text-primary mb-2">Acesso Necessário</h1>
      <p className="text-text-secondary text-sm mb-6">
        Você precisa do Protocolo da Reconquista para acessar esse conteúdo.
      </p>
      <a
        href="/profile"
        className="bg-primary text-white px-6 py-3 rounded-pill font-medium text-sm"
      >
        Ver planos
      </a>
    </div>
  </AppLayout>
)

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <h1 className="font-display text-2xl font-bold text-text-primary mb-2">Algo deu errado</h1>
          <p className="text-text-secondary text-sm mb-6">Ocorreu um erro inesperado. Recarregue a página para continuar.</p>
          <button onClick={() => window.location.reload()} className="bg-primary text-white px-6 py-3 rounded-pill font-medium">
            Recarregar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function AppRoutes() {
  return (
    <Routes>
      {/* Root: redirect based on auth state */}
      <Route path="/" element={<RootRedirect />} />

      {/* Auth: default landing for unauthenticated users */}
      <Route path="/auth" element={<AuthRoute />} />

      {/* Onboarding flow */}
      <Route path="/anamnese" element={<ProtectedRoute><Anamnese /></ProtectedRoute>} />
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />

      {/* Main app */}
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtocolRoute><Tasks /></ProtocolRoute>} />
      <Route path="/progress" element={<ProtocolRoute><Progress /></ProtocolRoute>} />
      <Route path="/modules" element={<ProtectedRoute><Modules /></ProtectedRoute>} />
      <Route path="/coach" element={
        isCoachEnabled()
          ? <ProtectedRoute><Coach /></ProtectedRoute>
          : <Navigate to="/progress" replace />
      } />
      <Route path="/sos" element={<ProtectedRoute><SOS /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
        <AppRoutes />
      </Suspense>
    </ErrorBoundary>
  )
}
