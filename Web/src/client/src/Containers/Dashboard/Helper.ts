import type { SensorData, SafeThresholds } from 'Shared/Data/Types/index.js'

/**
 * Formats a Date object or timestamp string into a readable time string.
 *
 * @param ts - The timestamp to format.
 * @return Formatted time string (HH:MM:SS).
 */
export const formatTimestamp = (ts: string | Date): string => {
	return new Date(ts).toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	})
}

/**
 * Calculates the system status based on current readings and safety thresholds.
 *
 * @param current - Current sensor readings.
 * @param thresholds - Active safety thresholds.
 * @return An object containing the status text and CSS class.
 */
export const calculateSystemStatus = (
	current: SensorData | null,
	thresholds: SafeThresholds | null
): { text: string; class: string } => {
	if (!current || !thresholds) {
		return { text: 'Loading...', class: '' }
	}

	const warnings: string[] = []

	if (current.temperature > thresholds.temperature.upper)
		warnings.push('Temp High')
	if (current.temperature < thresholds.temperature.lower)
		warnings.push('Temp Low')

	if (current.moisture < thresholds.moisture.lower) warnings.push('Soil Dry')
	if (current.moisture > thresholds.moisture.upper)
		warnings.push('Soil Too Wet')

	if (current.humidity < thresholds.humidity.lower) warnings.push('Air Dry')
	if (current.humidity > thresholds.humidity.upper)
		warnings.push('Air Too Humid')

	if (warnings.length > 0) {
		return {
			text: `Warning: ${warnings.join(', ')}`,
			class: 'status-warn',
		}
	}

	return { text: 'Optimal (Good)', class: 'status-good' }
}
