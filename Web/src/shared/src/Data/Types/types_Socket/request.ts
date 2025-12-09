import type { IoTAction } from 'Shared/Data/Constants/index.js'
import type { SensorData } from 'Shared/Data/Types/index.js'

/**
 * Represents a command to be sent to a device.
 *
 * @type CommandDevice
 * @property action - The action to be performed on the device.
 * @property [value] - Optional sensor data associated with the command.
 */
export type CommandDevice = {
    action: IoTAction
    value: boolean | SensorData
}

/**
 * Represents a command to start or stop the pump on the device.
 *
 * @interface PumpCommand
 * @property action - The action to start or stop the pump.
 * @property value - Boolean indicating whether to start (true) or stop (false) the pump.
 */
export interface PumpCommand extends CommandDevice {
    action: IoTAction.Pump
    value: boolean
}

/**
 * Represents a command to toggle auto mode on the device.
 *
 * @interface ToggleAutoCommand
 * @property action - The action to toggle auto mode.
 * @property value - Boolean indicating whether auto mode is enabled or disabled.
 */
export interface ToggleAutoCommand extends CommandDevice {
    action: IoTAction.ToggleAuto
    value: boolean
}

/**
 * Represents a command to set threshold values on the device.
 *
 * @interface SetThresholdCommand
 * @property action - The action to set threshold values.
 * @property value - The sensor data containing the new threshold values.
 */
export interface SetThresholdCommand extends CommandDevice {
    action: IoTAction.SetThreshold
    value: SensorData
}
