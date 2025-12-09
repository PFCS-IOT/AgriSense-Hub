import type { ServerUser } from 'Shared/Data/Types/index.js'

/**
 * Generic API Response Type Definition
 *
 * @type ApiResponse
 * @property {boolean} [success] - Indicates if the API request was successful
 * @property {string} [error] - Optional error message if the request failed
 * @property {unknown} [data] - Optional data returned from the API
 */
export type ApiResponse = {
    success?: boolean
    error?: string
    data?: any
}

/**
 * Login Response Type Definition
 *
 * @interface LoginResponse
 * @property {boolean} success - Indicates if the login was successful
 * @property {string} [error] - Optional error message if login failed
 * @property {string} [token] - Optional JWT token for authentication
 * @property {{ token: string; user: ServerUser }} [data] - Contains the JWT token and user information
 */
export interface LoginResponse extends ApiResponse {
    data?: {
        token: string
        user: ServerUser
    }
}
