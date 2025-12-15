import axios from 'axios'
import { MqttClient } from 'mqtt'
import chalk from 'chalk'

// import SensorRecord from 'Server/Models/SensorRecord.js'

/* Weather API Configuration - TP.HCM */
const WEATHER_LAT = 10.8231
const WEATHER_LON = 106.6297

// testing.. raindfall
// const WEATHER_LAT = 1.3521
// const WEATHER_LON = 103.8198

const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast'
const TOPIC_FORECAST = `/23127530/forecast`

/* MQTT Client Instance */
let mqttClient: MqttClient | null = null

/**
 * Initialize Weather Service with MQTT client instance
 *
 * @param client - The MQTT client instance
 */
export const initWeatherService = (client: MqttClient) => {
	mqttClient = client
	console.log(chalk.blue('✓ Weather Service initialized'))
}

/**
 * Fetch weather forecast from Open-Meteo API and publish to MQTT topic
 * Includes temperature, humidity, and average soil moisture from database
 */
export const fetchAndPublishWeatherForecast = async () => {
	try {
		// Fetch weather forecast from Open-Meteo
		const response = await axios.get(WEATHER_API_URL, {
			params: {
				latitude: WEATHER_LAT,
				longitude: WEATHER_LON,
				// current: 'temperature_2m,relative_humidity_2m',
				// temperature_unit: 'celsius',
				hourly: 'precipitation_probability',
				forecast_days: 1,
				timezone: 'Asia/Ho_Chi_Minh',
			},
		})

		// const data = response.data.current
		// if (!data) {
		// 	console.warn(
		// 		chalk.yellow('No weather data received from Open-Meteo')
		// 	)
		// 	return
		// }

		// Extract temperature and humidity from API response
		// const temp = data.temperature_2m
		// const hum = data.relative_humidity_2m

		const currentHourStr = new Date().toLocaleString('en-US', {
			timeZone: 'Asia/Ho_Chi_Minh',
			hour: 'numeric',
			hour12: false,
		})
		const currentHour = parseInt(currentHourStr)
		const rainProb =
			response.data.hourly?.precipitation_probability?.[currentHour] ?? 0
		// Fetch latest soil moisture from database (average of last 5 samples)
		// let soil = 50 // Default value if no records
		// try {
		// 	const records = (await SensorRecord.find()
		// 		.sort({ timestamp: -1 })
		// 		.limit(5)
		// 		.lean()
		// 		.exec()) as any[]

		// 	if (records && records.length > 0) {
		// 		const moistureValues = records
		// 			.map((r) =>
		// 				r && r.data && typeof r.data.moisture === 'number'
		// 					? r.data.moisture
		// 					: null
		// 			)
		// 			.filter((v) => v !== null) as number[]

		// 		if (moistureValues.length > 0) {
		// 			soil =
		// 				moistureValues.reduce((a, b) => a + b, 0) /
		// 				moistureValues.length
		// 		}
		// 	}
		// } catch (err) {
		// 	console.warn(
		// 		chalk.yellow('Failed to fetch soil moisture from database'),
		// 		err
		// 	)
		// }

		// Prepare forecast payload
		const forecast = {
			// temp: parseFloat(temp.toFixed(1)),
			// hum: parseFloat(hum.toFixed(1)),
			// soil: parseFloat(soil.toFixed(1)),
			rain_prob: rainProb,
		}

		console.log(
			chalk
				.cyan
				//`Weather Forecast: T:${forecast.temp}°C, H:${forecast.hum}%, S:${forecast.soil}%`
				()
		)

		// Publish to MQTT topic
		if (mqttClient?.connected) {
			mqttClient.publish(TOPIC_FORECAST, JSON.stringify(forecast))
			console.log(
				`${chalk.green('✓')} Published forecast to ${TOPIC_FORECAST}`
			)
		} else {
			//console.warn('MQTT not connected — cannot publish forecast')
		}
	} catch (err) {
		console.error(
			`${chalk.red('✗ Server: fetchAndPublishWeatherForecast error:')}`,
			err
		)
	}
}

/**
 * Start the weather forecast scheduler
 * Fetches weather data immediately and then every 16 seconds
 */
export const startWeatherForecastScheduler = () => {
	console.log(
		chalk.blue('Weather Forecast Scheduler started (every 30 seconds)')
	)

	// Fetch immediately on startup
	fetchAndPublishWeatherForecast().catch((err) => {
		console.error('Initial weather fetch failed:', err)
	})

	// Schedule periodic fetch every 16 seconds
	setInterval(() => {
		fetchAndPublishWeatherForecast().catch((err) => {
			console.error('Scheduled weather fetch failed:', err)
		})
	}, 16000) // 16 seconds
}

export default {
	initWeatherService,
	fetchAndPublishWeatherForecast,
	startWeatherForecastScheduler,
}
