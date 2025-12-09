import chalk from 'chalk'
import Mailgun from 'mailgun.js'
import FormData from 'form-data'

import Keys from 'Server/Config/Keys.js'
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
        key: key,
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
            const config = GetTemplate(type, data)
            if (!config) {
                throw new Error('Failed to prepare email template')
            }

            // Add sender and recipient to the email config
            config.from = `Online Auction! <no-reply@<${sender}>>`
            config.to = email

            // Send email via Mailgun
            return await MailService.mailgun.messages.create(domain, config)
        } catch (error) {
            console.log(`${chalk.red('✗ MailService.sendMail error:')} `, error)
            return error
        }
    },
}

export default MailService
