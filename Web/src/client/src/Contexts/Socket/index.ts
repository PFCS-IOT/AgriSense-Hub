import type { Socket } from 'socket.io-client'

import SocketContext from './context.js'
import SocketProvider from './provider.js'
import useSocket from './hook.js'

/**
 * Type definition for the Socket context value.
 *
 * @property socket - The current WebSocket connection or null.
 * @property connect - Function to establish a WebSocket connection.
 * @property disconnect - Function to close the WebSocket connection.
 */
export type SocketContextValueType = {
    socket: Socket | null
    connect: () => void
    disconnect: () => void
}

export { SocketContext, SocketProvider, useSocket }
