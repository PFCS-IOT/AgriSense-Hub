import React from 'react'

import PageContext from './context.js'

/**
 * Hook to access the Page context.
 *
 * @return The Page context value.
 */
export default function usePage() {
    return React.useContext(PageContext)
}
