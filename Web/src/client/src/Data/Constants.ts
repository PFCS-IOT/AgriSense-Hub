/**
 * The API_URL for making HTTP requests to the backend server.
 */
export const API_URL = import.meta.env.API_URL as string

/**
 * The SOCKET_URL for establishing WebSocket connections to the backend server.
 */
export const SOCKET_URL =
    window.location.host.indexOf('localhost') >= 0
        ? 'http://127.0.0.1:3000'
        : window.location.host

/**
 * Enumeration of different pages in the application.
 *
 * @enum {string} Page
 * @property {string} Home - The home page
 * @property {string} Login - The login page
 * @property {string} Signup - The signup page
 * @property {string} Dashboard - The user dashboard page
 */
export enum Page {
    Home = 'HOME',
    Login = 'LOGIN',
    Signup = 'SIGNUP',
}

/**
 * Enumeration of action types for page context management.
 *
 * @enum {string} PageAction
 * @property {string} SetPageTitle - Action to set the page title
 * @property {string} SetLoading - Action to set the loading state
 * @property {string} AddNotification - Action to add a notification
 * @property {string} RemoveNotification - Action to remove a notification
 */
export enum PageAction {
    SetPageTitle = 'SET_PAGE_TITLE',
    SetLoading = 'SET_LOADING',
    AddNotification = 'ADD_NOTIFICATION',
    RemoveNotification = 'REMOVE_NOTIFICATION',
}
