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
    const { dispatch } = usePage()

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
                const successId = `success-${Date.now()}`
                dispatch({
                    type: PageAction.AddNotification,
                    payload: {
                        id: successId,
                        message:
                            'If an account exists with that email, a reset link has been sent.',
                        type: 'success',
                    },
                })

                // Auto-remove notification after 5 seconds
                setTimeout(
                    () =>
                        dispatch({
                            type: PageAction.RemoveNotification,
                            payload: successId,
                        }),
                    5000
                )
            } else if (response.error) {
                throw new Error(response.error)
            }
        } catch (err: Error | unknown) {
            const errorId = `err-${Date.now()}`

            // Dispatch an error notification
            dispatch({
                type: PageAction.AddNotification,
                payload: {
                    id: errorId,
                    message:
                        typeof err === 'object' &&
                        err != null &&
                        'message' in err
                            ? (err as Error).message
                            : 'Failed to process request. Please try again.',
                    type: 'error',
                },
            })

            // Auto-remove notification after 5 seconds
            setTimeout(
                () =>
                    dispatch({
                        type: PageAction.RemoveNotification,
                        payload: errorId,
                    }),
                5000
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
