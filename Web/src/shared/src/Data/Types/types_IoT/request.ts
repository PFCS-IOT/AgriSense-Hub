import type { IoTDeviceStatus } from 'Shared/Data/Constants/index.js'
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
 * Pump State Update Structure
 *
 * @type DeviceStateUpdate
 * @property {boolean} enable - Whether the pump is enabled or disabled
 */
export type PumpStateUpdate = {
    enable: boolean
}
