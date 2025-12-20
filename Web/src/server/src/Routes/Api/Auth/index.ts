import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import chalk from 'chalk'
import assert from 'assert'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import {
	ApiResponse,
	LoginRequest,
	SignupRequest,
	LoginResponse,
} from 'Shared/Data/Types/index.js'
import Keys from 'Server/Config/Keys.js'
import User, { IUser } from 'Server/Models/User.js'
import Auth from 'Server/Middleware/Auth.js'
import Validate from 'Server/Middleware/Validate.js'
import { GetUserQueryFromCredential } from './Helper.js'

/** Router for authentication-related routes */
const router = express.Router()

// Extract JWT secret and token life from config
const { secret, tokenLife } = Keys.jwt
assert(secret, 'JWT secret is not configured.')
assert(tokenLife, 'JWT token life is not configured.')

/**
 * Route to get the currently authenticated user.
 *
 * @route GET /auth/me
 */
router.get('/me', Auth, async (req: Request, res: Response) => {
	try {
		const user = req.user as IUser
		res.status(200).json({ success: true, data: { user: user.toObject() } })
	} catch (error) {
		console.error(
			`${chalk.red('Error fetching authenticated user:')} ${error}`
		)
		res.status(400).json({
			error: 'Your request could not be processed. Please try again.',
		})
	}
})

/**
 * Login route.
 * Authenticates user with email and password.
 *
 * @route POST /auth/login
 */
router.post(
	'/login',
	Validate([
		body('credential')
			.notEmpty()
			.withMessage('You must enter your email or username.'),
		body('password').notEmpty().withMessage('You must enter a password.'),
	]),
	async (req: Request, res: Response) => {
		try {
			const { password } = req.body as LoginRequest

			// Find user with the given credential
			const user = await User.findOne(
				await GetUserQueryFromCredential(req)
			)
			if (!user) {
				return res
					.status(400)
					.send({ error: 'No user found for this credential.' })
			}

			// Check password
			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch) {
				return res.status(400).json({
					error: 'Password Incorrect',
				})
			}

			// Create JWT token
			const payload = { id: user.id as string }
			const token = jwt.sign(payload, secret as jwt.Secret, {
				expiresIn: tokenLife,
			})

			// Response with token and user info
			const response: LoginResponse = {
				success: true,
				data: {
					token: token,
					user: user.toObject(),
				},
			}
			res.status(200).json(response)
		} catch (error) {
			console.error(`${chalk.red('Error during login:')} ${error}`)
			res.status(400).json({
				error: 'Your request could not be processed. Please try again.',
			})
		}
	}
)

/**
 * Registration route.
 * Registers a new user and sends a signup email.
 *
 * @route POST /auth/signup
 */
router.post(
	'/signup',
	Validate([
		body('username')
			.notEmpty()
			.withMessage('You must enter your username.')
			.matches(/^[1-9a-zA-Z_-]+$/)
			.withMessage(
				'Username can only contain latin letters, numbers, underscores, and hyphens.'
			),
		body('email')
			.optional({ nullable: true })
			.isEmail()
			.withMessage('You must enter a valid email address.'),
		body('phoneNumber')
			.optional({ nullable: true })
			.isMobilePhone('any')
			.withMessage('You must enter a valid phone number.'),
		body('password')
			.isLength({ min: 6 })
			.withMessage('Password must be at least 6 characters long.'),
	]),
	async (req: Request, res: Response) => {
		try {
			const { username, phoneNumber, password, email } =
				req.body as SignupRequest

			// Check if username already exists
			if (await User.findOne({ username })) {
				return res
					.status(400)
					.json({ error: 'That username is already in use.' })
			}

			// Check if email is provided and already in use
			if (email && (await User.findOne({ email }))) {
				return res.status(400).json({
					error: 'That email address is already in use.',
				})
			}

			// Check if phone number is provided and already in use
			if (phoneNumber && (await User.findOne({ phoneNumber }))) {
				return res.status(400).json({
					error: 'That phone number is already in use.',
				})
			}

			// Hash password
			const salt = await bcrypt.genSalt(10)
			const hash = await bcrypt.hash(password, salt)

			// Create new user and save to database
			await new User({
				email: email,
				phoneNumber: phoneNumber,
				username: username,
				password: hash,
			}).save()

			// Respond with user info and token
			const response: ApiResponse = {
				success: true,
				data: {},
			}
			res.status(200).json(response)
		} catch (error) {
			console.error(`${chalk.red('Error during registration:')} ${error}`)
			res.status(400).json({
				error: 'Your request could not be processed. Please try again.',
			})
		}
	}
)

export default router
