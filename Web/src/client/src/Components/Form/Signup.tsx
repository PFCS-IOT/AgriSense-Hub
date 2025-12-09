import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import type { SignupRequest } from 'Shared/Data/Types/index.ts'
import { usePage } from 'Client/Contexts/Page/index.js'

/**
 * Extended Signup Data Type
 *
 * @type SignupData
 * @property {string} username - The user's username
 * @property {string} [email] - The user's email address
 * @property {string} [phoneNumber] - The user's phone number
 * @property {string} password - The user's password
 * @property {string} confirmPassword - Confirmation of the user's password
 */
export interface SignupData extends SignupRequest {
    confirmPassword: string
}

/**
 * RegisterForm component for user registration.
 *
 * @param props - The props for the RegisterForm component.
 * @return The RegisterForm component.
 */
const RegisterForm: React.FC<{
    onSignup: (data: SignupData) => void
}> = (props) => {
    const { pageState } = usePage()

    const [formData, setFormData] = useState<SignupData>({
        username: '',
        email: undefined,
        phoneNumber: undefined,
        password: '',
        confirmPassword: '',
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    /**
     * Validates the registration form inputs.
     *
     * @return True if the inputs are valid, false otherwise.
     */
    const validate = () => {
        const newErrors: Record<string, string> = {}
        let isValid = true

        if (!formData.username || !formData.username.trim()) {
            newErrors.username = 'Username is required'
            isValid = false
        }

        if (
            formData.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            newErrors.email = 'Invalid email address'
            isValid = false
        }

        if (
            formData.phoneNumber &&
            !/^[0-9+\-\s()]+$/.test(formData.phoneNumber)
        ) {
            newErrors.phoneNumber = 'Invalid phone number'
            isValid = false
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
            isValid = false
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
            isValid = false
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    /**
     * Handles input changes.
     *
     * @param e - The input change event.
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value == '' ? null : value }))

        // Clear specific error on change
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }))
        }
    }

    /**
     * Handles form submission.
     *
     * @param e - The form submission event.
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validate()) {
            props.onSignup(formData)
        }
    }

    /**
     * Renders an input field with error handling.
     *
     * @param name - The name of the input field.
     * @param type - The type of the input field.
     * @param placeholder - The placeholder text for the input field.
     * @param required - Whether the input field is required.
     * @return The rendered input field.
     */
    const renderInput = (
        name: keyof typeof formData,
        type: string,
        placeholder: string,
        required = false
    ) => (
        <div className="form-group">
            <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={pageState.loading}
                className={errors[name] ? 'input-error' : ''}
            />
            {errors[name] && (
                <span className="error-message">{errors[name]}</span>
            )}
        </div>
    )

    return (
        <div className="login-container">
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit}>
                {renderInput('username', 'text', 'Username *', true)}
                {renderInput('email', 'text', 'Email (Optional)')}
                {renderInput('phoneNumber', 'text', 'Phone Number (Optional)')}
                {renderInput(
                    'password',
                    'password',
                    'Password (Min 6 chars) *',
                    true
                )}
                {renderInput(
                    'confirmPassword',
                    'password',
                    'Confirm Password *',
                    true
                )}

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={pageState.loading}
                >
                    {pageState.loading ? 'Creating Account...' : 'Register'}
                </button>

                <div className="auth-actions">
                    <span>Already have an account? </span>
                    <Link to="/login" className="auth-link">
                        Login here
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default RegisterForm
