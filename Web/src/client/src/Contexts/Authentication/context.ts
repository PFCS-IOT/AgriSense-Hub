import React from 'react'

import type { AuthenticationContextValueType } from './index.js'

/**
 * Default values for the Authentication context value.
 */
export const DEFAULT: AuthenticationContextValueType = {
    user: null,
    isAuthenticated: false,
    isLoading: true,

    login: () => {},
    logout: () => {},
    refetchUser: async () => {},
}

/**
 * Context for managing authentication and token.
 */
const AuthenticationContext = React.createContext(DEFAULT)

export default AuthenticationContext
