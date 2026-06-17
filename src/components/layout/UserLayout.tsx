import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

export function UserLayout(): React.ReactNode {
  const location = useLocation()

  const HIDE_LAYOUT_ROUTES = ['/ai']

const hideLayout = HIDE_LAYOUT_ROUTES.includes(location.pathname)

  return (
    <div className="min-h-screen flex flex-col">
      {!hideLayout && <Navbar />}

      <div className="flex-1">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </div>

      {!hideLayout && <Footer />}
    </div>
  )
}