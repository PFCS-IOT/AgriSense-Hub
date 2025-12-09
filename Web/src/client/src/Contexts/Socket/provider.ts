import io, { Socket } from 'socket.io-client'
import React, { useState, createElement } from 'react'
import type { ReactNode } from 'react'

import { SOCKET_URL } from 'Client/Data/Constants.js'
import SocketContext from './context.js'

/**
 * Provider for the SocketContext.
 *
 * @param children - The child components that will have access to the SocketContext.
 * @return The SocketContext provider component.
 */
const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [socket, setSocket] = useState(null as Socket | null)

	/**
	 * Connects to the WebSocket server using the token stored in localStorage.
	 */
	const connect = () => {
		if (socket) return // Already connected

		const token = localStorage.getItem('token')
		const sk = io(SOCKET_URL, {
			autoConnect: false,
		})

		// Only connect if a token is available
		if (token) {
			sk.auth = { token }
			sk.connect()
			setSocket(sk)
		}
	}

	/**
	 * Disconnects from the WebSocket server.
	 */
	const disconnect = () => {
		if (socket) {
			socket.close()
			setSocket(null)
		}
	}

	return createElement(
		SocketContext.Provider,
		{
			value: {
				socket,
				connect,
				disconnect,
			},
		},
		children
	)
}

export default SocketProvider
