/**
 * Defines the possible statuses for IoT devices.
 *
 * @enum {string} IoTDeviceStatus
 * @property {string} Active - Device is active and operational
 * @property {string} Inactive - Device is inactive or not reachable
 * @property {string} Warning - Device is experiencing warnings
 * @property {string} Error - Device has encountered an error
 * @property {string} Unknown - Device status is unknown
 */
export enum IoTDeviceStatus {
    Active = 'ACTIVE',
    Inactive = 'INACTIVE',
    Error = 'ERROR',
    Unknown = 'UNKNOWN',
}

/**
 * Defines the possible IoT device actions.
 *
 * @enum {string} IoTAction
 * @property {string} Pump - Action to start or stop the pump
 * @property {string} ToggleAuto - Action to toggle auto pump mode
 * @property {string} SetThreshold - Action to set new threshold values
 */
export enum IoTAction {
    Pump = 'PUMP',
    ToggleAuto = 'TOGGLE_AUTO',
    SetThreshold = 'SET_THRESHOLD',
}

/** Maximum number of sensor records to store in memory */
export const MAX_SENSOR_RECORD_STORE = 20
