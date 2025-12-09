import { PageAction } from 'Client/Data/Constants.js'

/**
 * Notification type for page state management.
 *
 * @type Notification
 * @property {string} id - Unique identifier for the notification
 * @property {string} message - The notification message
 * @property {'success' | 'error' | 'info'} type - The type of notification
 */
export type Notification = {
    id: string
    message: string
    type: 'success' | 'error' | 'info'
}

/**
 * Page state interface for managing page-related data.
 *
 * @type PageState
 * @property {string} title - The title of the current page
 * @property {boolean} loading - Indicates if the page is in a loading state
 * @property {Notification[]} notifications - List of notifications for the page
 */
export type PageState = {
    title: string
    loading: boolean
    notifications: Notification[]
}

/**
 * Action to set the page title
 *
 * @type SetPageTitleAction
 * @property {string} type - The action type
 * @property {string} payload - The new title for the page
 */
export type SetPageTitleAction = {
    type: PageAction.SetPageTitle
    payload: string
}

/**
 * Action to set the loading state
 *
 * @type SetLoadingAction
 * @property {string} type - The action type
 * @property {boolean} payload - The new loading state
 */
export type SetLoadingAction = {
    type: PageAction.SetLoading
    payload: boolean
}

/**
 * Action to add a notification
 *
 * @type AddNotificationAction
 * @property {string} type - The action type
 * @property {Notification} payload - The notification to be added
 */
export type AddNotificationAction = {
    type: PageAction.AddNotification
    payload: Notification
}

/**
 * Action to remove a notification
 *
 * @type RemoveNotificationAction
 * @property {string} type - The action type
 * @property {string} payload - The ID of the notification to be removed
 */
export type RemoveNotificationAction = {
    type: PageAction.RemoveNotification
    payload: string
}

/**
 * A union of all possible actions for the PageReducer.
 *
 * @type PageReducerAction
 */
export type PageReducerAction =
    | SetPageTitleAction
    | SetLoadingAction
    | AddNotificationAction
    | RemoveNotificationAction
