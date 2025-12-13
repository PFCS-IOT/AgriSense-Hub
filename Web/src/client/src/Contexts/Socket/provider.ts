import io, { Socket } from 'socket.io-client'
import React, {
	useRef,
	useState,
	useCallback,
	useEffect,
	createElement,
	type ReactNode,
} from 'react'

import { SOCKET_URL } from 'Client/Data/Constants.js'
import SocketContext from './context.js'
import { useAuth } from 'Client/Contexts/Authentication/index.js'

/**
 * Provider for the SocketContext.
 *
 * @param props - Props containing child components to wrap.
 * @return The SocketContext provider component.
 */
const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const { isAuthenticated } = useAuth()
	const token = useRef(localStorage.getItem('token'))

	const [socket] = useState<Socket>(
		io(SOCKET_URL, {
			transports: ['websocket'],
			autoConnect: false,
			reconnection: true,
			reconnectionAttempts: 5,
		})
	)
	const [connected, setConnected] = useState(false)

	// Setup socket event listeners
	useEffect(() => {
		// Setup Event Listeners
		socket.on('connect', () => {
			console.log('Socket Connected:', socket?.id)
			setConnected(true)
		})

		socket.on('disconnect', () => {
			console.log('Socket Disconnected')
			setConnected(false)
		})

		socket.on('connect_error', (err) => {
			console.error('Socket Connection Error:', err)
		})
	}, [])

	// Manage socket connection based on authentication state
	useEffect(() => {
		if (isAuthenticated) {
			token.current = localStorage.getItem('token')
			connect()
		} else {
			disconnect()
		}
	}, [isAuthenticated])

	/**
	 * Establishes a new socket connection using the current JWT token.
	 */
	const connect = useCallback(() => {
		// Prevent multiple connections or connecting without a token
		if (socket.connected || !token.current) return

		// Set authentication token in socket options
		socket.auth = { token: `Bearer ${token.current}` }
		try {
			socket.connect()
			setConnected(true)
		} catch (error) {
			console.error('Socket connection error:', error)
		}
	}, [])

	/**
	 * Disconnects the socket if it is active.
	 */
	const disconnect = useCallback(() => {
		if (socket.connected) {
			try {
				socket.disconnect()
				setConnected(false)
			} catch (error) {
				console.error('Socket disconnection error:', error)
			}
		}
	}, [])

	return createElement(
		SocketContext.Provider,
		{
			value: {
				socket: socket,
				connected,
				connect,
				disconnect,
			},
		},
		children
	)
}

export default SocketProvider
