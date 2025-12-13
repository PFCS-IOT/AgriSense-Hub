import React, { createElement, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import chalk from 'chalk'

import type { ServerUser, LoginResponse } from 'Shared/Data/Types/index.js'
import { PageAction } from 'Client/Data/Constants.js'
import { Auth } from 'Client/Config/Api.js'
import { usePage } from 'Client/Contexts/Page/index.js'
import AuthenticationContext from './context.js'

/**
 * Provider for the Authentication context.
 *
 * @param children - The child components that will have access to the SocketContext.
 * @return The Authentication context provider component.
 */
const AuthenticationProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const { notify } = usePage()

	const [user, setUser] = useState<ServerUser | null>(null)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	/**
	 * Fetch the current authenticated user from the server.
	 */
	const fetchUser = useCallback(async () => {
		const token = localStorage.getItem('token')

		// No token, user is not authenticated
		if (!token) {
			// Notify user of missing token
			notify(
				'error',
				'No authentication token found. Please log in again.',
				5
			)

			// Clear authentication state
			setUser(null)
			setIsAuthenticated(false)
			setIsLoading(false)
			return
		}

		// Token exists, verify it with the server
		try {
			const response = await Auth.me()
			const responseData = response.data

			if (responseData.success && responseData.data) {
				setUser(responseData.data.user)
				setIsAuthenticated(true)
			} else if (responseData.error) {
				throw new Error(responseData.error)
			}
		} catch (error: Error | unknown) {
			// Notify user of the error
			notify(
				'error',
				typeof error === 'object' && error != null && 'message' in error
					? (error as Error).message
					: 'Authentication failed. Please log in again.',
				5
			)

			// Clear authentication state
			localStorage.removeItem('token')
			setUser(null)
			setIsAuthenticated(false)
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchUser()
	}, [fetchUser])

	/**
	 * Logs in a user by setting the authentication token and user state.
	 *
	 * @param data - The login response data containing the token and user information.
	 */
	const login = ({ data }: LoginResponse) => {
		if (data) {
			localStorage.setItem('token', data.token)
			setUser(data.user)
			setIsAuthenticated(true)
		}
	}

	/**
	 * Logs out the current user.
	 * Clears the authentication token and resets user state.
	 */
	const logout = () => {
		localStorage.removeItem('token')
		setUser(null)
		setIsAuthenticated(false)
	}

	return createElement(
		AuthenticationContext.Provider,
		{
			value: {
				user,
				isAuthenticated,
				isLoading,
				login,
				logout,
				refetchUser: fetchUser,
			},
		},
		children
	)
}

export default AuthenticationProvider
