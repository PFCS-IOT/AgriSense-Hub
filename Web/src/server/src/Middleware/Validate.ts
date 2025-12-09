import { Request, Response, NextFunction } from 'express'
import { ValidationChain, validationResult } from 'express-validator'

import { ApiResponse } from 'Shared/Data/Types/index.js'

/**
 * Middleware to validate request data based on provided validation chains.
 * It stops and responds on the first validation error.
 *
 * @param validations - Array of validation chains
 * @returns Express middleware function
 */
export default (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        for (const validation of validations) {
            // Run validation and get the result
            await validation.run(req)
            const errors = validationResult(req)

            // If there are validation errors, respond and skip to the next middleware
            if (!errors.isEmpty()) {
                const firstError = errors.array()[0]
                const response: ApiResponse = {
                    error: firstError
                        ? firstError.msg
                        : 'Unknown validation error',
                }
                return res.status(400).json(response)
            }
        }

        return next()
    }
}
