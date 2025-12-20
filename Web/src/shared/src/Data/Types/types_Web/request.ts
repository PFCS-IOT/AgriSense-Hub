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
