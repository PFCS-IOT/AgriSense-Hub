import { Schema, Document, model } from 'mongoose'

import { SensorRecordType } from 'Shared/Data/Types/index.js'

/**
 * Interface representing a Sensor document in MongoDB.
 *
 * @interface IUser
 * @property {SensorData} data - The sensor data
 * @property {Date} timestamp - The timestamp of the record
 */
export interface ISensorRecord extends SensorRecordType, Document {}

/**
 * Mongoose schema for the Sensor model.
 */
const SensorRecordSchema = new Schema({
    data: {
        type: {
            temperature: { type: Number, required: true },
            humidity: { type: Number, required: true },
            moisture: { type: Number, required: true },
        },
        required: true,
    },
    timestamp: { type: Date, required: true, unique: true },
})

export default model('SensorRecord', SensorRecordSchema)
