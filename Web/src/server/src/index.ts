// Load environment variables from .env file
import './Utility/Dotenv.js'

import express from 'express'
import http from 'http'
import chalk from 'chalk'
import cors from 'cors'
import helmet from 'helmet'

// Import application configurations and routes
import Routes from 'Server/Routes/index.js'
import Keys from 'Server/Config/Keys.js'
import SetupDB from 'Server/Utility/Database.js'
import SetupSocket from 'Server/Modules/Socket.js'
import InitializePassport from 'Server/Config/Passport.js'

// Initialize Express application
const app = express()

// Middleware to parse URL-encoded data and JSON data
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Middleware to enhance security by setting various HTTP headers
app.use(
    helmet({
        contentSecurityPolicy: false, // Disable CSP for compatibility reasons
        frameguard: true, // Enable frameguard to prevent clickjacking
    })
)

// Middleware to enable Cross-Origin Resource Sharing
app.use(cors())

// Connect to the MongoDB database
SetupDB()

// Initialize Passport for authentication
InitializePassport(app)

// Mount all application routes
app.use(Routes)

// Start the server and listen on the specified port
const port = Keys.port
const sever = http.createServer(app).listen(port, () => {
    console.log(
        `${chalk.green('✓')} ${chalk.blue(
            `Server is running on port ${port}! Visit https://${Keys.host}:${port}/ in your browser.`
        )}`
    )
})

// Initialize WebSocket server
SetupSocket(sever)
