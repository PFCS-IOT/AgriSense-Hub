import axios from 'axios'

import Keys from 'Config/Keys.js'

/**
 * Handle SMS sending via Text-Bee
 *
 * @server
 * @class SmsService
 */
const SmsService = {
	/**
	 * Send SMS using Text-Bee API
	 *
	 * @param recipients - Array of recipient phone numbers
	 * @param message - Message content to send
	 * @returns Promise resolving to Text-Bee response or error
	 */
	async sendSMS(recipients: string[], message: string) {
		try {
			const response = await axios.post(
				'https://api.textbee.dev/api/v1/gateway/devices/{YOUR_DEVICE_ID}/send-sms',
				{
					recipients: recipients,
					message: message,
				},
				{
					headers: {
						'x-api-key': Keys.textbee.apiKey,
					},
				}
			)
			console.log('SMS Sent:', response.data)
			return response.data
		} catch (error) {
			console.error('Error sending SMS:', error)
			return error
		}
	},
}

export default SmsService
