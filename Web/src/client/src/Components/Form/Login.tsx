import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import type { LoginRequest } from 'Shared/Data/Types/index.js'
import { usePage } from 'Client/Contexts/Page/index.js'

/**
 * LoginForm component for user authentication.
 *
 * @param props - The props for the LoginForm component.
 * @return The LoginForm component.
 */
const LoginForm: React.FC<{
	onLogin: (credentials: LoginRequest) => void
}> = (props) => {
	const { pageState } = usePage()

	const [credential, setCredential] = useState('')
	const [password, setPassword] = useState('')
	const [errors, setErrors] = useState({ credential: '', password: '' })

	/**
	 * Validates the login form inputs.
	 *
	 * @return True if the inputs are valid, false otherwise.
	 */
	const validate = () => {
		const newErrors = { credential: '', password: '' }
		let isValid = true

		if (!credential.trim()) {
			newErrors.credential =
				'Please enter your username or email or phone number'
			isValid = false
		}
		if (!password) {
			newErrors.password = 'Please enter your password'
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
			props.onLogin({ credential, password })
		}
	}

	const handleInputChange =
		(setter: React.Dispatch<React.SetStateAction<string>>, field: string) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setter(e.target.value)
			// Clear error for this field when user types
			setErrors((prev) => ({ ...prev, [field]: '' }))
		}

	return (
		<div className="login-container">
			<h2>Welcome Back</h2>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<input
						type="text"
						value={credential}
						onChange={handleInputChange(
							setCredential,
							'credential'
						)}
						placeholder="Username, Email or Phone"
						disabled={pageState.loading}
						className={errors.credential ? 'input-error' : ''}
					/>
					{errors.credential && (
						<span className="error-message">
							{errors.credential}
						</span>
					)}
				</div>

				<div className="form-group">
					<input
						type="password"
						value={password}
						onChange={handleInputChange(setPassword, 'password')}
						placeholder="Password"
						disabled={pageState.loading}
						className={errors.password ? 'input-error' : ''}
					/>
					{errors.password && (
						<span className="error-message">{errors.password}</span>
					)}
				</div>

				<button
					type="submit"
					className="submit-btn"
					disabled={pageState.loading}
				>
					{pageState.loading ? 'Logging in...' : 'Login'}
				</button>

				<div className="auth-actions">
					<div style={{ marginTop: '10px' }}>
						<span>Don't have an account? </span>
						<Link to="/signup" className="auth-link">
							Sign Up
						</Link>
					</div>
				</div>
			</form>
		</div>
	)
}

export default LoginForm
