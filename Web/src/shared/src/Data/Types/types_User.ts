import { ROLES } from 'Shared/Data/Constants/index.js'

/**
 * Mail Type Definition
 *
 * @type Mail
 * @property {string} [from] - The sender's email address
 * @property {string} [to] - The recipient's email address
 * @property {string} subject - The subject of the email
 * @property {string} text - The body text of the email
 */
export type Mail = {
    from?: string
    to?: string
    subject: string
    text: string
}

/**
 * Client User Type Definition
 *
 * @type ClientUser
 * @property {string} username - The user's username.
 * @property {ROLES} role - The user's role in the system.
 */
export type ClientUser = {
    username: string
    role: ROLES
}

/**
 * Server User Type Definition
 *
 * @type ServerUserType
 * @property {string} [email] - The user's email address.
 * @property {string} [phoneNumber] - The user's phone number.
 * @property {string} username - The user's username.
 * @property {string} password - The user's password (optional for OAuth users).
 * @property {ROLES} role - The user's role in the system.
 * @property {string} [resetPasswordToken] - Token for password reset (optional).
 * @property {Date} [resetPasswordExpires] - Expiration date for the reset token (optional).
 */
export type ServerUser = ClientUser & {
    email?: string | null
    phoneNumber?: string | null
    password: string
    resetPasswordToken?: string | null
    resetPasswordExpires?: Date | null
}
