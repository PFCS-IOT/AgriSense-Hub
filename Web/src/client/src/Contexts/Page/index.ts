import type { Dispatch } from 'react'

import type { PageState, PageReducerAction } from 'Client/Data/Types/index.js'
import PageContext from './context.js'
import PageProvider from './provider.js'
import usePage from './hook.js'

/**
 * Type definition for the Socket context value.
 *
 * @property {PageState} pageState - The current state of the page
 * @property {Function} dispatch - Function to dispatch actions to update the page state
 */
export type PageContextValueType = {
    pageState: PageState
    dispatch: Dispatch<PageReducerAction>
}

export { PageContext, PageProvider, usePage }
