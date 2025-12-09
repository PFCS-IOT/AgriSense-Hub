import type {
    ServerUser as User,
    LoginResponse,
} from 'Shared/Data/Types/index.js'
import AuthenticationContext from './context.js'
import AuthenticationProvider from './provider.js'
import useAuth from './hook.js'

/**
 * Type definition for the Authentication context value.
 *
 * @property user - The currently authenticated user or null if not authenticated.
 * @property isAuthenticated - Indicates if the user is authenticated.
 * @property isLoading - Indicates if the authentication status is being determined.
 * @property login - Function to log in a user with token and user data.
 * @property logout - Function to log out the current user.
 * @property refetchUser - Function to re-fetch the current authenticated user from the server.
 */
export type AuthenticationContextValueType = {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean

    login: ({ data }: LoginResponse) => void
    logout: () => void
    refetchUser: () => Promise<void>
}

export { AuthenticationContext, AuthenticationProvider, useAuth }
