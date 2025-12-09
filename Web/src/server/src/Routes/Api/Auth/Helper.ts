import { Request } from 'express'
import { body, validationResult, ValidationChain } from 'express-validator'

/**
 * Constructs a user query object based on the provided credential in the request.
 * The credential can be an email, phone number, or username.
 *
 * @param req - Express request object
 * @returns An object representing the user query
 */
export async function GetUserQueryFromCredential(req: Request): Promise<{
    [key: string]: string
}> {
    const credential: string = req.body.credential as string

    let validation: ValidationChain
    let query: { [key: string]: string }

    // Build validation and query based on if is email, phone number, or username
    if (credential.includes('@')) {
        // Validate email format
        validation = body('credential')
            .isEmail()
            .withMessage('You must enter a valid email address.')

        // Build query for email
        query = { email: credential }
    } else if (credential.match(/^[0-9]+$/)) {
        // Validate phone number format
        validation = body('credential')
            .isMobilePhone('any')
            .withMessage('You must enter a valid phone number.')

        // Build query for phone number
        query = { phoneNumber: credential }
    } else {
        // Validate username format
        validation = body('credential')
            .matches(/^[1-9a-zA-Z_-]+$/)
            .withMessage(
                'Username can only contain latin letters, numbers, underscores, and hyphens.'
            )

        // Build query for username
        query = { username: credential }
    }

    // Validate the credential
    await validation.run(req)
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const firstError = errors.array()[0]
        throw new Error(
            firstError ? firstError.msg : 'Unknown validation error'
        )
    } else {
        return query
    }
}
