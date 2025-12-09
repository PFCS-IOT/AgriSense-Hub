/**
 * Defines the roles for users in the system.
 *
 * @enum {string} ROLES
 * @property {string} Admin - Administrator with full access
 * @property {string} User - Regular logged-in user
 * @property {string} Guest - Non-logged-in user
 */
export enum ROLES {
    Admin = 'ROLE ADMIN',
    User = 'ROLE USER',
    Guest = 'ROLE GUEST',
}

/**
 * Name of the JWT cookie used for authentication.
 *
 * @constant {string} JWT_COOKIE
 */
export const JWT_COOKIE = 'x-jwt-cookie'
