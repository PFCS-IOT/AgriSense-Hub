import React from 'react'

import type { PlantContextValueType } from './index.js'

/**
 * Default values for the PlantContext.
 */
export const DEFAULT: PlantContextValueType = {
	selectedPlant: null,
	availablePlants: [],
	isAutoMode: false,
	isPumpActive: false,
	thresholds: null,

	currentReadings: null,
	recordHistory: [],

	onPlantChange: () => {},
	onAutoToggle: () => {},
	onPumpToggle: () => {},
}

/**
 * Context for managing plant-related state and actions.
 */
const PlantContext = React.createContext(DEFAULT)

export default PlantContext
