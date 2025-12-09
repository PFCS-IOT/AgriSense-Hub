import React from 'react'

import AuthenticationContext from './context.js'

/**
 * Hook to access the Authentication context.
 *
 * @return The Authentication context value.
 */
export default function useAuth() {
    return React.useContext(AuthenticationContext)
}
