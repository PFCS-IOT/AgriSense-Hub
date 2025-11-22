import Mailgun from 'mailgun.js'
import FormData from 'form-data'

import Keys from 'Config/Keys.js'
import GetTemplate from './Template.js'

// Extract api key and domain for mailgun
const { key, domain, sender } = Keys.mailgun

/**
 * Handle mail sending via Mailgun
 *
 * @server
 * @class MailService
 */
const MailService = {
	mailgun: new Mailgun(FormData).client({
		username: 'api',
		key: key || 'API_KEY',
	}), // Mailgun client instance for sending emails

	/**
	 * Send an email using Mailgun
	 *
	 * @param email - Recipient email address
	 * @param type - Type of email to send
	 * @param data - Data for the email template
	 * @returns Promise resolving to Mailgun response or error
	 */
	async sendMail(email: string, type: string, data: any): Promise<any> {
		try {
			// Prepare email template
			const message = GetTemplate(type, data)
			if (!message) {
				throw new Error('Failed to prepare email template')
			}

			// Configure email parameters
			const config = {
				from: `Online Auction! <no-reply@<${sender}>>`,
				to: email,
				subject: message.subject,
				text: message.text,
			}

			// Send email via Mailgun
			return await MailService.mailgun.messages.create(
				domain || 'DOMAIN_NAME',
				config
			)
		} catch (error) {
			console.error('Error sending email:', error)
			return error
		}
	},
}

export default MailService
