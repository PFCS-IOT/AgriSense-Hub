import React from 'react'

import PlantContext from './context.js'

/**
 * Hook to access the Plant context.
 *
 * @return The Plant context value.
 */
export default function usePlant() {
	return React.useContext(PlantContext)
}
