import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import type { ForgotPasswordRequest } from 'Shared/Data/Types/index.js'
import { usePage } from 'Client/Contexts/Page/index.js'

/**
 * Component for the Forgot Password form.
 *
 * @return The ForgotPasswordForm component.
 */
const ForgotPasswordForm: React.FC<{
    onSubmit: (data: ForgotPasswordRequest) => void
}> = (props) => {
    const { pageState } = usePage()
    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState<{ email: string }>({ email: '' })

    /**
     * Validates the form inputs.
     *
     * @return True if the inputs are valid, false otherwise.
     */
    const validate = () => {
        const newErrors = { email: '' }
        let isValid = true

        if (!email.trim()) {
            newErrors.email = 'Please enter your email address'
            isValid = false
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address'
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    /**
     * Handles form submission.
     *
     * @param e - The form submission event.
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (validate()) {
            props.onSubmit({ email })
        }
    }

    /**
     * Handles input changes.
     *
     * @param e - The input change event.
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
        // Clear error for this field when user types
        if (errors.email) {
            setErrors((prev) => ({ ...prev, email: '' }))
        }
    }

    return (
        <div className="login-container">
            <h2>Reset Password</h2>
            <p
                style={{
                    marginBottom: '20px',
                    color: '#666',
                    fontSize: '0.9em',
                }}
            >
                Enter the email address associated with your account and we'll
                send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        value={email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        disabled={pageState.loading}
                        className={errors.email ? 'input-error' : ''}
                    />
                    {errors.email && (
                        <span className="error-message">{errors.email}</span>
                    )}
                </div>

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={pageState.loading}
                >
                    {pageState.loading ? 'Sending...' : 'Send Reset Link'}
                </button>

                <div className="auth-actions">
                    <Link to="/login" className="auth-link">
                        &larr; Back to Login
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default ForgotPasswordForm
