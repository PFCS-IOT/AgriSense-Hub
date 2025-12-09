import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from 'Client/Contexts/Authentication/index.js'

/**
 * Protected Route component to guard routes that require authentication.
 *
 * @return The ProtectedRoute component.
 */
const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return <div>Loading...</div>
    }
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoute
