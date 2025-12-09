/**
 * Sensor Data Structure
 *
 * @type SensorData
 * @property {number} temperature - Temperature sensor data
 * @property {number} humidity - Humidity sensor data
 * @property {number} moisture - Soil moisture sensor data
 */
export type SensorData = {
	temperature: number
	humidity: number
	moisture: number
}

/**
 * Sensor Record Structure
 *
 * @type SensorRecordType
 * @property {SensorData} data - The sensor data
 * @property {Date} timestamp - The timestamp of the record
 */
export type SensorRecordType = {
	data: SensorData
	timestamp: Date
}

/**
 * Safe Thresholds Structure for Sensors
 *
 * @type SafeThresholds
 * @property {{ upper: number; lower: number }} temperature - Safe thresholds for temperature
 * @property {{ upper: number; lower: number }} humidity - Safe thresholds for humidity
 * @property {{ upper: number; lower: number }} moisture - Safe thresholds for soil moisture
 */
export type SafeThresholds = {
	temperature: { upper: number; lower: number }
	humidity: { upper: number; lower: number }
	moisture: { upper: number; lower: number }
}

/**
 * Plant Profile for managing plant-specific thresholds
 *
 * @type PlantProfileType
 * @property {string} plantType - The type of the plant
 * @property {SafeThresholds} safeThresholds - The safe thresholds for the plant
 */
export type PlantProfileType = {
	plantType: string
	safeThresholds: SafeThresholds
}
