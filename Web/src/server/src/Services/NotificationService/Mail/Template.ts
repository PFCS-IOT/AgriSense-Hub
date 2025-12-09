import assert from 'assert'

import Keys from 'Server/Config/Keys.js'
import type { Mail, SensorData } from 'Shared/Data/Types/index.js'

/**
 * Reset Password Mail Template
 *
 * @param resetToken - The reset token for the user
 * @returns The reset password mail template
 */
function resetPasswordEmail(resetToken: string): Mail {
    return {
        subject: 'Reset Password',
        text:
            'You are receiving this because you have requested to reset your password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            `http:/${Keys.host}/reset-password/${resetToken}\n\n` +
            'If you did not request this, please ignore this mail and your password will remain unchanged.\n',
    }
}

/**
 * Confirmation Mail Template after Password Reset
 *
 * @returns The confirmation mail template after password reset
 */
function confirmResetPasswordEmail(): Mail {
    return {
        subject: 'Password Changed',
        text:
            'You are receiving this mail because you changed your password. \n\n' +
            'If you did not request this change, please contact us immediately.',
    }
}

/**
 * Signup Mail Template
 *
 * @param username - The username of the user
 * @returns The signup mail template
 */
function signupEmail(username: string): Mail {
    return {
        subject: 'Account Registration',
        text: `Hi ${username}! Thank you for creating an account with us!.`,
    }
}

/**
 * Alert Mail Template for Critical Sensor Data
 * * @param username - User's name
 * @param warnings - List of specific warning messages
 * @param data - The actual sensor readings
 * @returns The alert mail template
 */
function alertEmail(
    username: string,
    warnings: string[],
    data: SensorData
): Mail {
    return {
        subject: '⚠️ CRITICAL ALERT: Farm Sensor Warning',
        text:
            `Hello ${username},\n\n` +
            `Warning! The following sensor readings are outside safe thresholds:\n` +
            warnings.map((w) => `- ${w}`).join('\n') +
            '\n\n' +
            `Current Readings:\n` +
            `- Temperature: ${data.temperature}°C\n` +
            `- Humidity: ${data.humidity}%\n` +
            `- Soil Moisture: ${data.moisture}%\n\n` +
            `Please check your system immediately.\n` +
            `Dashboard: https://${Keys.host}/dashboard`,
    }
}

/**
 * Prepare mail template based on type
 *
 * @param type - type of mail
 * @param data - Data for the mail
 * @returns The prepared mail template or null if type is unknown
 */
export default function (type: string, data: any): Mail | null {
    let message: Mail | null = null

    switch (type) {
        case 'signup':
            assert(
                data.username && typeof data.username == 'string',
                'Name data is required for signup mail'
            )
            message = signupEmail(data.username)
            break

        case 'reset':
            assert(
                data.resetToken && typeof data.resetToken == 'string',
                'Reset token is required for reset password email'
            )
            message = resetPasswordEmail(data.resetToken)
            break

        case 'reset-confirmation':
            message = confirmResetPasswordEmail()
            break

        case 'alert':
            assert(data.username, 'Username required for alert')
            assert(
                data.warnings && Array.isArray(data.warnings),
                'Warnings array required'
            )
            assert(data.sensorData, 'Sensor data required')
            message = alertEmail(data.username, data.warnings, data.sensorData)
            break

        default:
            console.warn(`Unknown mail type: ${type}`)
    }

    return message
}
