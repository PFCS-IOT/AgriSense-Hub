import chalk from 'chalk'
import nodemailer from 'nodemailer'

import Keys from 'Server/Config/Keys.js'

/**
 * Create a Nodemailer transporter using Gmail service
 *
 * @prop transporter
 * @property {string} service - Email service provider
 * @property {object} auth - Authentication details for the email account
 */
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: Keys.email.user,
		pass: Keys.email.pass,
	},
})

/**
 * Send an email using the configured transporter
 *
 * @param toEmail - Recipient email address
 * @param subject - Email subject
 * @param htmlContent - HTML content of the email
 */
export const sendEmail = async (
	toEmail: string,
	subject: string,
	htmlContent: string
) => {
	const mailOptions = {
		from: `"AgriHub System" <${Keys.email.user}>`,
		to: toEmail,
		subject: subject,
		html: htmlContent,
	}

	try {
		await transporter.sendMail(mailOptions)
		console.log(chalk.green(`✓ Đã gửi mail tới: ${toEmail}`))
		return true
	} catch (error: any) {
		console.error(chalk.red(`✗ Lỗi gửi tới ${toEmail}:`), error.message)
		return false
	}
}

export default sendEmail
