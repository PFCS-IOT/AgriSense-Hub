import { Schema, Document, model } from 'mongoose'

import { PlantProfileType } from 'Shared/Data/Types/index.js'

/**
 * Interface representing a PlantProfile document in MongoDB.
 *
 * @interface IPlantProfile
 * @property {string} plantType - The type of the plant associated with the profile.
 * @property {{ upper: number; lower: number }} temperature - Safe thresholds for temperature.
 * @property {{ upper: number; lower: number }} humidity - Safe thresholds for humidity.
 * @property {{ upper: number; lower: number }} moisture - Safe thresholds for soil moisture.
 */
export interface IPlantProfile extends PlantProfileType, Document {}

/**
 * Mongoose sub-schema for measurement thresholds.
 */
const ThresholdSchema = new Schema(
	{
		upper: { type: Number, required: true },
		lower: { type: Number, required: true },
	},
	{ _id: false }
)

/**
 * Mongoose schema for a plant's ideal environmental profile.
 */
const PlantProfileSchema = new Schema({
	plantType: {
		type: String,
		required: true,
		unique: true,
	},
	safeThresholds: {
		type: {
			temperature: { type: ThresholdSchema, required: true },
			humidity: { type: ThresholdSchema, required: true },
			moisture: { type: ThresholdSchema, required: true },
		},
		required: true,
	},
})

export default model('PlantProfile', PlantProfileSchema)
