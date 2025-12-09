import axios from 'axios'

import type {
	LoginRequest,
	SignupRequest,
	ForgotPasswordRequest,
	ResetPasswordRequest,
} from 'Shared/Data/Types/index.js'
import type {
	ApiResponse,
	LoginResponse,
	ServerUser,
} from 'Shared/Data/Types/index.js'
import Keys from 'Client/Config/Keys.js'

/**
 * Axios instance configured for API calls.
 */
const api = axios.create({
	baseURL: Keys.apiUrl,
	headers: { 'Content-Type': 'application/json' },
})

/**
 * Interceptor to add the JWT token to every outgoing request if it exists.
 */
api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token')
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

/**
 * Authentication related API calls.
 */
export const Auth = {
	/**
	 * Fetches the currently authenticated user's information.
	 *
	 * @returns A promise resolving to the API response containing user information.
	 */
	me: (): Promise<{ body: { user: ServerUser } } & any> =>
		api.get('/auth/me'),

	/**
	 * Logs in a user with the provided credentials.
	 *
	 * @param requestBody - The login request body containing username and password.
	 * @returns A promise resolving to the login response containing the JWT token.
	 */
	login: (
		requestBody: LoginRequest
	): Promise<{ body: LoginResponse } & any> =>
		api.post('/auth/login', requestBody),

	/**
	 * Registers a new user with the provided details.
	 *
	 * @param requestBody - The registration request body containing user details.
	 * @returns A promise resolving to the registration response.
	 */
	signup: (
		requestBody: SignupRequest
	): Promise<{ body: LoginResponse } & any> =>
		api.post('/auth/signup', requestBody),

	/**
	 * Initiates the forgot password process for a user.
	 *
	 * @param requestBody - The forgot password request body containing user identifier.
	 * @returns A promise resolving to the forgot password response.
	 */
	forgotPassword: (
		requestBody: ForgotPasswordRequest
	): Promise<{ body: ApiResponse } & any> =>
		api.post('/auth/forgot', requestBody),

	/**
	 * Resets the user's password using the provided token and new password.
	 *
	 * @param requestBody - The reset password request body containing token and new password.
	 * @returns A promise resolving to the reset password response.
	 */
	resetPassword: (
		requestBody: ResetPasswordRequest
	): Promise<{ body: ApiResponse } & any> =>
		api.post('/auth/reset', requestBody),

	/**
	 * Resets the user's password using the provided token in the URL and new password.
	 *
	 * @param requestBody - The reset password request body containing the new password.
	 * @param token - The reset token from the URL.
	 * @returns A promise resolving to the reset password response.
	 */
	resetPasswordWithToken: (
		requestBody: ResetPasswordRequest,
		token: string
	): Promise<{ body: ApiResponse } & any> =>
		api.post(`/auth/reset/${token}`, requestBody),
}

export default api
