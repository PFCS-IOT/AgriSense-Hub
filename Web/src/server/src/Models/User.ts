import { Schema, Document, model } from 'mongoose'
import { ServerUser } from 'Shared/Data/Types/index.js'
import { ROLES } from 'Shared/Data/Constants/index.js'

/**
 * Interface representing a User document in MongoDB.
 *
 * @interface IUser
 * @property {string} email - The user's email address.
 * @property {string} phoneNumber - The user's phone number.
 * @property {string} username - The user's username.
 * @property {string} password - The user's password (optional for OAuth users).
 * @property {ROLES} role - The user's role in the system.
 * @property {string} [resetPasswordToken] - Token for password reset (optional).
 * @property {Date} [resetPasswordExpires] - Expiration date for the reset token (optional).
 */
export interface IUser extends ServerUser, Document {}

/**
 * Mongoose schema for the User model.
 */
const UserSchema = new Schema(
    {
        email: { type: String, unique: true, trim: true },
        phoneNumber: { type: String, unique: true, trim: true },
        password: { type: String, required: true },
        username: { type: String, required: true, unique: true, trim: true },
        role: {
            type: String,
            default: ROLES.User,
            enum: Object.values(ROLES),
        },
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date },
    },
    { timestamps: true }
)

export default model('User', UserSchema)
