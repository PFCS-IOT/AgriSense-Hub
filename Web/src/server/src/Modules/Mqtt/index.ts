import mqtt, { IClientOptions, MqttClient } from 'mqtt'
import { Server } from 'socket.io'
import chalk from 'chalk'
import axios from 'axios' // Task2 - HUY QUANG TRUONG

import {
	SensorData,
	SensorUpdate,
	DeviceStateUpdate,
} from 'Shared/Data/Types/index.js'
import Keys from 'Server/Config/Keys.js'
import User from 'Server/Models/User.js'
import SensorRecord from 'Server/Models/SensorRecord.js'
import {
	initHandler,
	broadcastSensorData,
	broadcastDeviceStateUpdate,
	PlantManager,
} from './Handler.js'
import NotificationService from 'Server/Services/NotificationService/index.js'
import GetSmsTemplate from 'Server/Services/NotificationService/Sms/Template.js'

/* MQTT Client Setup */
const MQTT_CONFIG: IClientOptions = {
	host: Keys.mqtt.host,
	port: Keys.mqtt.port,
	protocol: 'mqtts',
	username: Keys.mqtt.user,
	password: Keys.mqtt.pass,
	rejectUnauthorized: true,
}

/* MQTT Client Instance */
let mqttClient: MqttClient

/* MQTT Topics */
const topicData = `devices/${Keys.mqtt.deviceId}/data`
const topicCommands = `devices/${Keys.mqtt.deviceId}/commands`

/*Task1 - HUY QUANG TRUONG*/
const topicPump = `/23127530/pump`
/*Task2 - HUY QUANG TRUONG*/
const topicForecast = `/23127530/forecast`
/*Task4 - HUY QUANG TRUONG*/
const topicSensorData = `/23127530/Temperature_Humidity_Moisture`

/* Weather API Configuration - TP.HCM */
const WEATHER_LAT = 10.8231
const WEATHER_LON = 106.6297
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast'
/*Task2 - HUY QUANG TRUONG*/

/**
 * Check sensor data against safe thresholds and notify users if needed
 *
 * @param sensorData - The latest sensor data to check
 */
const checkAndNotify = async (sensorData: SensorData) => {
	console.log(
		chalk.blue(
			`Sensor Check: T:${sensorData.temperature}C, H:${sensorData.humidity}%, M:${sensorData.moisture}%`
		)
	)

	try {
		const profile = PlantManager.currentPlantProfile
		if (!profile) {
			console.warn(
				chalk.yellow(
					'⚠️ No Plant Profile Loaded. Skipping sensor check.'
				)
			)
			return
		}

		// Check sensor data against thresholds
		const warnings: string[] = []
		const safeThresholds = profile.safeThresholds

		if (sensorData.temperature > safeThresholds.temperature.upper)
			warnings.push('High Temp')
		if (sensorData.temperature < safeThresholds.temperature.lower)
			warnings.push('Low Temp')

		if (sensorData.humidity < safeThresholds.humidity.lower)
			warnings.push('Low Humidity')
		if (sensorData.humidity > safeThresholds.humidity.upper)
			warnings.push('High Humidity')

		if (sensorData.moisture < safeThresholds.moisture.lower)
			warnings.push('Low Moisture (Dry)')
		if (sensorData.moisture > safeThresholds.moisture.upper)
			warnings.push('High Moisture (Waterlogged)')

		// Check if any warnings were generated
		if (warnings.length > 0) {
			console.log(
				chalk.magenta(
					`⚠️ Critical Sensor Data Detected: ${warnings.join(', ')}`
				)
			)
			const users = await User.find().lean().exec()

			// Prepare SMS content once
			const smsMessage = GetSmsTemplate('alert', {
				warnings,
				sensorData,
			})

			// Notify all users via Email and SMS
			for (const user of users) {
				if (user.email) {
					NotificationService.MailService.sendMail(
						user.email,
						'alert',
						{
							username: user.username,
							warnings: warnings,
							sensorData: sensorData,
						}
					)
				}

				if (user.phoneNumber && smsMessage) {
					NotificationService.SmsService.sendSMS(
						[user.phoneNumber],
						smsMessage
					)
				}
			}
		}
	} catch (error) {
		console.error(
			chalk.red(
				'Error while checking sensor data against safe thresholds:'
			),
			error
		)
	}
}

/**
 * Initialize MQTT connection and set up message handling
 *
 * @param io - The Socket.io server instance
 */
export const initMqtt = (io: Server) => {
	// Initialize handler to load latest sensor updates
	initHandler()

	// Connect to MQTT Broker
	mqttClient = mqtt.connect(MQTT_CONFIG)

	// Handle successful connection
	mqttClient.on('connect', () => {
		console.log(
			`${chalk.green('✓')} ${chalk.blue('Server: Connected to MQTT Broker (TLS)')}`
		)

		// Subscribe to topics for all known devices
		mqttClient.subscribe(topicData, (err) => {
			if (err) {
				console.error(
					`${chalk.red('✗ Server: MQTT Subscription Error:')}`,
					err
				)
			} else {
				console.log(
					`${chalk.green('✓')} ${chalk.blue(`Server: Subscribed to topic ${topicData}`)}`
				)
			}
		})
		/*Task4 - HUY QUANG TRUONG*/
		// Subscribe to new sensor data topic
		mqttClient.subscribe(topicSensorData, (err) => {
			if (err) {
				console.error(
					`${chalk.red('✗ Server: MQTT Subscription Error for sensor topic:')}`,
					err
				)
			} else {
				console.log(
					`${chalk.green('✓')} ${chalk.blue(`Server: Subscribed to topic ${topicSensorData}`)}`
				)
			}
		})
		/*Task4 - HUY QUANG TRUONG*/

		/*Task2 - HUY QUANG TRUONG*/
		startWeatherForecastScheduler()
		/*Task2 - HUY QUANG TRUONG*/
	})

	// Handle incoming MQTT messages
	mqttClient.on('message', async (topic, message) => {
		if (!topic || !message) return // Ignore invalid topics or messages

		/*Task4 - HUY QUANG TRUONG*/
		try {
			// Handle new sensor data topic
			if (topic === topicSensorData) {
				const parsedData = JSON.parse(message.toString()) as {
					temp: number
					hum: number
					soil: number
				}

				// Convert incoming format to SensorData format
				const sensorData = {
					temperature: parsedData.temp,
					humidity: parsedData.hum,
					moisture: parsedData.soil,
				}

				console.log(
					chalk.blue(
						`Received from ${topic}: T:${sensorData.temperature}°C, H:${sensorData.humidity}%, M:${sensorData.moisture}%`
					)
				)

				// Save sensor record to database
				const newSensorRecord = new SensorRecord({
					data: sensorData,
					timestamp: new Date(),
				})
				await newSensorRecord.save()

				/*Task1 - HUY QUANG TRUONG*/
				// After saving, evaluate pump decision based on last 5 moisture samples
				await evaluateAndPublishPumpDecision().catch((err) => {
					console.error(
						`${chalk.red('✗ Server: Pump Evaluation Error:')}`,
						err
					)
				})
				/*Task1 - HUY QUANG TRUONG*/

				// Check sensor data and notify users if needed
				await checkAndNotify(sensorData)

				// Broadcast sensor data to websocket clients
				broadcastSensorData(io, {
					sensorData: sensorData,
				})

				return
			}

			// Parse the incoming message for other topics
			const parsedMessage = JSON.parse(message.toString()) as
				| SensorUpdate
				| DeviceStateUpdate
			/*Task4 - HUY QUANG TRUONG*/

			// Check if the parsed message contains sensor data
			if (parsedMessage.hasOwnProperty('sensorData')) {
				const sensorUpdate = parsedMessage as SensorUpdate

				// Save sensor record to database
				const newSensorUpdate = new SensorRecord({
					data: sensorUpdate.sensorData,
					timestamp: new Date(),
				})
				/*Task1 - HUY QUANG TRUONG*/
				try {
					await newSensorUpdate.save()
				} catch (err) {
					console.error(
						`${chalk.red('✗ Server: Database Sensor Save Error:')}`,
						err
					)
				}
				/*Task1 - HUY QUANG TRUONG*/

				/*Task1 - HUY QUANG TRUONG*/
				// After saving, evaluate pump decision
				await evaluateAndPublishPumpDecision().catch((err) => {
					console.error(
						`${chalk.red('✗ Server: Pump Evaluation Error:')}`,
						err
					)
				})
				/*Task1 - HUY QUANG TRUONG*/

				// Check sensor data and notify users if needed
				await checkAndNotify(sensorUpdate.sensorData)

				// Broadcast sensor data to websocket clients
				broadcastSensorData(io, sensorUpdate)
			} else if (parsedMessage.hasOwnProperty('enable')) {
				const pumpStateUpdate = parsedMessage as DeviceStateUpdate

				// Broadcast pump state update to websocket clients
				broadcastDeviceStateUpdate(io, pumpStateUpdate)
			}
		} catch (err) {
			console.error(
				`${chalk.red('✗ Server: MQTT Message Parse Error:')}`,
				err
			)
		}
	})

	// Handle connection errors
	mqttClient.on('error', (err) => {
		console.error(`${chalk.red('✗ Server: MQTT Error:')}`, err)
	})

	// Handle reconnection attempts
	mqttClient.on('reconnect', () => {
		console.log(
			`${chalk.yellow('⚠ Server: Reconnecting to MQTT Broker...')}`
		)
	})
}
/*Task1 - HUY QUANG TRUONG*/
/**
 * Publish command to a device via MQTT
 *
 * @param deviceId - ID of the target device
 * @param command - Command to send to the device
 */
// Publish pump command to dedicated pump topic
export const publishPumpCommand = (command: 'YES' | 'NO') => {
	if (mqttClient?.connected) {
		mqttClient.publish(topicPump, command)
		console.log(`Published pump command "${command}" to ${topicPump}`)
	} else {
		console.warn('MQTT not connected — cannot publish pump command')
	}
}

/**
 * Evaluate last 5 moisture samples and publish YES/NO to pump topic
 * S_trungbinh = (1/5) * sum(Si) for last 5 samples
 */
export const evaluateAndPublishPumpDecision = async () => {
	try {
		const records = (await SensorRecord.find()
			.sort({ timestamp: -1 })
			.limit(5)
			.lean()
			.exec()) as any[]

		if (!records || records.length < 5) {
			console.log(
				'Not enough sensor records to evaluate pump decision (need 5).'
			)
			return
		}

		// Extract moisture values and ensure they are numbers
		const values = records
			.map((r) =>
				r && r.data && typeof r.data.moisture === 'number'
					? r.data.moisture
					: null
			)
			.filter((v) => v !== null) as number[]

		if (values.length < 5) {
			console.log(
				'Not enough valid moisture values to evaluate pump decision.'
			)
			return
		}

		const sum = values.reduce((a, b) => a + b, 0)
		const avg = sum / 5

		console.log(`Average moisture (last 5) = ${avg}`)

		const command: 'YES' | 'NO' = avg <= 40 ? 'YES' : 'NO'
		publishPumpCommand(command)
	} catch (err) {
		console.error(
			`${chalk.red('✗ Server: evaluateAndPublishPumpDecision error:')}`,
			err
		)
	}
}
/*Task1 - HUY QUANG TRUONG*/

/**
 * Publish command to a device via MQTT
 *
 * @param deviceId - ID of the target device
 * @param command - Command to send to the device
 */
export const publishToDevice = (command: string) => {
	if (mqttClient?.connected) {
		mqttClient.publish(topicCommands, command)
		console.log(`Sent "${command}" to ${topicCommands}`)
	}
}

/*Task2 - HUY QUANG TRUONG*/
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
				current: 'temperature_2m,relative_humidity_2m',
				temperature_unit: 'celsius',
				timezone: 'Asia/Ho_Chi_Minh',
			},
		})

		const data = response.data.current
		if (!data) {
			console.warn(
				chalk.yellow('No weather data received from Open-Meteo')
			)
			return
		}

		// Extract temperature and humidity from API response
		const temp = data.temperature_2m
		const hum = data.relative_humidity_2m

		// Fetch latest soil moisture from database (average of last 5 samples)
		let soil = 50 // Default value if no records
		try {
			const records = (await SensorRecord.find()
				.sort({ timestamp: -1 })
				.limit(5)
				.lean()
				.exec()) as any[]

			if (records && records.length > 0) {
				const moistureValues = records
					.map((r) =>
						r && r.data && typeof r.data.moisture === 'number'
							? r.data.moisture
							: null
					)
					.filter((v) => v !== null) as number[]

				if (moistureValues.length > 0) {
					soil =
						moistureValues.reduce((a, b) => a + b, 0) /
						moistureValues.length
				}
			}
		} catch (err) {
			console.warn(
				chalk.yellow('⚠️Failed to fetch soil moisture from database'),
				err
			)
		}

		// Prepare forecast payload
		const forecast = {
			temp: parseFloat(temp.toFixed(1)),
			hum: parseFloat(hum.toFixed(1)),
			soil: parseFloat(soil.toFixed(1)),
		}

		console.log(
			chalk.cyan(
				`📊 Weather Forecast: T:${forecast.temp}°C, H:${forecast.hum}%, S:${forecast.soil}%`
			)
		)

		// Publish to MQTT topic
		if (mqttClient?.connected) {
			mqttClient.publish(topicForecast, JSON.stringify(forecast))
			console.log(
				`${chalk.green('✓')} Published forecast to ${topicForecast}`
			)
		} else {
			console.warn('MQTT not connected — cannot publish forecast')
		}
	} catch (err) {
		console.error(
			`${chalk.red('✗ Server: fetchAndPublishWeatherForecast error:')}`,
			err
		)
	}
}

// Schedule weather forecast fetch every 16s
export const startWeatherForecastScheduler = () => {
	console.log(
		chalk.blue('Weather Forecast Scheduler started (every 16 seconds)')
	)

	// Fetch immediately on startup
	fetchAndPublishWeatherForecast().catch((err) => {
		console.error('Initial weather fetch failed:', err)
	})

	// Schedule periodic fetch
	setInterval(() => {
		fetchAndPublishWeatherForecast().catch((err) => {
			console.error('Scheduled weather fetch failed:', err)
		})
	}, 16000) // 16 seconds
}
/*Task2 - HUY QUANG TRUONG*/

export default null
