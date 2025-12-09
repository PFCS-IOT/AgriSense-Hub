/**
 * Login Request Type
 *
 * @type LoginRequest
 * @property {string} credential - The user's username or email
 * @property {string} password - The user's password
 */
export type LoginRequest = {
	credential: string
	password: string
}

/**
 * Signup Request Type
 *
 * @type SignupRequest
 * @property {string} [email] - The user's email address
 * @property {string} [phoneNumber] - The user's phone number
 * @property {string} username - The user's username
 * @property {string} password - The user's password
 */
export type SignupRequest = {
	email?: string
	phoneNumber?: string
	username: string
	password: string
}

/**
 * Forgot Password Request Type
 *
 * @type ForgotPasswordRequest
 * @property {string} email - The user's email
 */
export type ForgotPasswordRequest = {
	email: string
}

/**
 * Reset Password Request Type
 *
 * @type ResetPasswordRequest
 * @property {string} token - The password reset token
 * @property {string} newPassword - The new password
 */
export type ResetPasswordRequest = {
	token: string
	newPassword: string
}
