import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from 'react-router'

import {
  Navigate
} from 'react-router-dom'

import { StrictMode, useContext, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthContext } from './contexts/auth.context'
import LayoutConnected from './pages/private/layout'
import RegisterPage from './pages/public/register/page'
import SignInPage from './pages/public/sign-in/page'
import AppContent from './AppContent'
import { Toaster } from 'sonner'
import MyOrders from './pages/private/ordens'
import HomePage from './pages/private/home'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './services/queryClient'
import Rebalanceamento from './pages/private/rebalanceamento'
import DarfsPage from './pages/private/darfs'
import MinhaCarteiraDeAtivos from './pages/private/carteira'
import Impostos from './pages/private/impostos'
import MeusDividendos from './pages/private/dividendos'

const basename = import.meta.env.BASE_URL

interface RouteProps {
  children :ReactNode
}

function ProtectedRoute({ children } :RouteProps) {
  const { loginResponse } = useContext(AuthContext)
  const isAuthenticated = !!loginResponse

  setTimeout(() => {
    if(!isAuthenticated) {
      return <Navigate to={'/sign-in'} replace />
    }
  }, 500);

  return <>{children}</>
}

function PublicRoute({ children } :RouteProps) {
  const { loginResponse } = useContext(AuthContext)
  const isAuthenticated = !!loginResponse

  if(isAuthenticated) {
    return <Navigate to={'/carteira'} replace />
  }

  return <>{children}</>
}

function App() {
  const router = createBrowserRouter([
    {
      element: <AppContent />,
      children: [
        // --- Grupo de Rotas Públicas ---
        {
          element: (
            <PublicRoute>
              <Outlet />
            </PublicRoute>
          ),
          children: [
            { index: true, element: <Navigate to={'/sign-in'} replace /> },
            { path: '/', element: <SignInPage /> },
            { path: '/sign-in', element: <SignInPage /> },
            { path: '/register', element: <RegisterPage /> },
          ],
        },

        // --- Grupo de Rotas Privadas/Protegidas ---
        {
          element: (
            <ProtectedRoute>
              <LayoutConnected>
                <Outlet />
              </LayoutConnected>
            </ProtectedRoute>
          ),
          children: [
            { index: true, element: <Navigate to={'/carteira'} replace /> },
            { path: '/carteira', element: <HomePage /> },
            { path: '/carteira/portifolio', element: <MinhaCarteiraDeAtivos /> },
            { path: '/carteira/ordens', element: <MyOrders /> },
            { path: '/carteira/rebalanceamento', element: <Rebalanceamento /> },
            { path: '/carteira/impostos', element: <Impostos /> },
            { path: '/carteira/darfs', element: <DarfsPage /> },
            { path: '/carteira/dividendos', element: <MeusDividendos /> }
          ],
        },
      ],
    },
    // --- Rota Opcional: Not Found (404) Route (Pode ser filho do AppContent ou aqui) ---
    // Se for filho do AppContent, precisaria estar dentro de um Outlet ou ter seu próprio element.
    // É mais simples deixá-lo aqui fora do children do AppContent para uma rota catch-all simples.
    {
      path: '*',
      element: <div>404 - Página não encontrada</div>,
    }
  ], { basename })

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </StrictMode>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
