import assert from 'assert'
import type { Name, Email } from 'Data/Types/index.js'

/**
 * Reset Password Email Template
 *
 * @param resetToken - The reset token for the user
 * @returns The reset password email template
 */
function resetPasswordEmail(host: string, resetToken: string): Email {
	return {
		subject: 'Reset Password',
		text:
			'You are receiving this because you have requested to reset your password for your account.\n\n' +
			'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
			`https:/${host}/reset-password/${resetToken}\n\n` +
			'If you did not request this, please ignore this email and your password will remain unchanged.\n',
	}
}

/**
 * Confirmation Email Template after Password Reset
 *
 * @returns The confirmation email template after password reset
 */
function confirmResetPasswordEmail(): Email {
	return {
		subject: 'Password Changed',
		text:
			'You are receiving this email because you changed your password. \n\n' +
			'If you did not request this change, please contact us immediately.',
	}
}

/**
 * Signup Email Template
 *
 * @param name - The name of the user
 * @returns The signup email template
 */
function signupEmail(name: Name): Email {
	return {
		subject: 'Account Registration',
		text: `Hi ${name.firstName} ${name.lastName}! Thank you for creating an account with us!.`,
	}
}

/**
 * Contact Email Template
 *
 * @returns The contact email template
 */
function contactEmail(): Email {
	return {
		subject: 'Contact Us',
		text: 'We received your message! Our team will contact you soon. \n\n',
	}
}

/**
 * Prepare email template based on type
 *
 * @private
 * @param type - type of email
 * @param data - Data for the email
 * @returns The prepared email template or null if type is unknown
 */
export default function (type: string, data: any): Email | null {
	let message: Email | null = null

	switch (type) {
		case 'signup':
			assert(
				data.name &&
					typeof data.name == 'object' &&
					typeof data.name.firstName == 'string' &&
					typeof data.name.lastName == 'string',
				'Name data is required for signup email'
			)
			message = signupEmail(data.name)
			break

		case 'reset':
			assert(
				data.host &&
					typeof data.host == 'string' &&
					data.resetToken &&
					typeof data.resetToken == 'string',
				'Reset token is required for reset password email'
			)
			message = resetPasswordEmail(data.host, data.resetToken)
			break

		case 'reset-confirmation':
			message = confirmResetPasswordEmail()
			break

		case 'contact':
			message = contactEmail()
			break

		default:
			console.warn(`Unknown email type: ${type}`)
	}

	return message
}
