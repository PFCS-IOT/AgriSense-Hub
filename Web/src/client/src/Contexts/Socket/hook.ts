import React from 'react'

import SocketContext from './context.js'

/**
 * Hook to access the Socket context.
 *
 * @return The Socket context value.
 */
export default function useSocket() {
	return React.useContext(SocketContext)
}
