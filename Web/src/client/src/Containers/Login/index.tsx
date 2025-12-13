import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import type { LoginRequest } from 'Shared/Data/Types/index.js'
import { PageAction } from 'Client/Data/Constants.js'
import { Auth } from 'Client/Config/Api.js'
import { usePage } from 'Client/Contexts/Page/index.js'
import { useAuth } from 'Client/Contexts/Authentication/index.js'
import LoginForm from 'Client/Components/Form/Login.js'

/**
 * Container component for handling user login.
 *
 * @param onLoginSuccess - Callback function to be called on successful login.
 * @return The LoginContainer component.
 */
const LoginContainer: React.FC = () => {
	const navigate = useNavigate()

	const { dispatch, notify } = usePage()
	const { isAuthenticated, login } = useAuth()

	/**
	 * Redirect to dashboard if already authenticated.
	 */
	useEffect(() => {
		if (isAuthenticated) {
			navigate('/dashboard', { replace: true })
		}
	}, [isAuthenticated, navigate])

	/**
	 * Handle user login.
	 *
	 * @param credentials - The login credentials.
	 */
	const handleLogin = async (credentials: LoginRequest) => {
		dispatch({ type: PageAction.SetLoading, payload: true })
		dispatch({ type: PageAction.SetPageTitle, payload: 'Logging In...' })

		try {
			const response = await Auth.login(credentials)
			const responseData = response.data

			// Handle successful login
			if (responseData.success) {
				notify(
					'success',
					'Login successful! Redirecting to dashboard...',
					5
				)
				login(responseData)
			} else if (responseData.error) {
				throw new Error(responseData.error)
			}
		} catch (err: Error | unknown) {
			notify(
				'error',
				typeof err === 'object' && err != null && 'message' in err
					? (err as Error).message
					: 'Login failed. Please check your credentials.',
				5
			)
		} finally {
			dispatch({ type: PageAction.SetLoading, payload: false })
			dispatch({ type: PageAction.SetPageTitle, payload: 'Login' })
		}
	}

	return <LoginForm onLogin={handleLogin} />
}

export default LoginContainer
