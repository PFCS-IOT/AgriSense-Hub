import type { IoTDeviceState } from 'Shared/Data/Constants/index.js'
import type { SensorData } from 'Shared/Data/Types/types_Sensor.js'

/**
 * Sensor Update Structure
 *
 * @type SensorUpdata
 * @property {IoTDeviceStatus} status - The status of the IoT device
 * @property {SensorData} sensorData - The sensor data including temperature, humidity, and moisture
 */
export type SensorUpdate = {
	sensorData: SensorData
}

/**
 * Deivce State Update Structure
 *
 * @type DeviceStateUpdate
 * @property {IoTDeviceState} state - The state component to update (e.g., 'pump', 'autoMode')
 * @property {boolean} enable - Whether the pump is enabled or disabled
 */
export type DeviceStateUpdate = {
	state: IoTDeviceState
	enable: boolean
}
