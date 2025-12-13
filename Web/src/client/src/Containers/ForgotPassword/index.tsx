import React from 'react'

import type { ForgotPasswordRequest } from 'Shared/Data/Types/index.js'
import { PageAction } from 'Client/Data/Constants.js'
import { Auth } from 'Client/Config/Api.js'
import { usePage } from 'Client/Contexts/Page/index.js'
import ForgotPasswordForm from 'Client/Components/Form/ForgotPassword.js'

/**
 * Container component for handling forgot password requests.
 *
 * @return The ForgotPasswordContainer component.
 */
const ForgotPasswordContainer: React.FC = () => {
	const { dispatch, notify } = usePage()

	/**
	 * Handle forgot password request.
	 *
	 * @param credentials - The forgot password credentials.
	 */
	const handleForgotPassword = async (credentials: ForgotPasswordRequest) => {
		dispatch({ type: PageAction.SetLoading, payload: true })
		dispatch({
			type: PageAction.SetPageTitle,
			payload: 'Recovering Password...',
		})

		try {
			const response = await Auth.forgotPassword(credentials)

			// Handle successful request
			if (response.success) {
				notify(
					'success',
					'If an account exists with that email, a reset link has been sent.',
					5
				)
			} else if (response.error) {
				throw new Error(response.error)
			}
		} catch (err: Error | unknown) {
			notify(
				'error',
				typeof err === 'object' && err != null && 'message' in err
					? (err as Error).message
					: 'Failed to process request. Please try again.',
				5
			)
		} finally {
			dispatch({ type: PageAction.SetLoading, payload: false })
			dispatch({
				type: PageAction.SetPageTitle,
				payload: 'Forgot Password',
			})
		}
	}

	return <ForgotPasswordForm onSubmit={handleForgotPassword} />
}

export default ForgotPasswordContainer
