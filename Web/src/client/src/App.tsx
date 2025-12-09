import React, { use, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import {
	useAuth,
	AuthenticationProvider,
} from 'Client/Contexts/Authentication/index.js'
import { usePage, PageProvider } from 'Client/Contexts/Page/index.js'
import { useSocket, SocketProvider } from 'Client/Contexts/Socket/index.ts'
import { PlantProvider } from 'Client/Contexts/Plant/index.js'
import ProtectedRoute from 'Client/Components/ProtectedRoute.js'
import NotificationList from 'Client/Components/NotificationList.js'

import LoginContainer from 'Client/Containers/Login/index.js'
import SignupContainer from 'Client/Containers/Signup/index.js'
import ForgotPasswordContainer from 'Client/Containers/ForgotPassword/index.js'
import DashboardContainer from 'Client/Containers/Dashboard/index.js'

const AppContent: React.FC = () => {
	// State to track if the user is authenticated
	// const { isAuthenticated } = useAuth()
	const { pageState } = usePage()
	const { isAuthenticated } = useAuth()
	const { connect, disconnect } = useSocket()

	// Update document title based on page state
	useEffect(() => {
		document.title = pageState.title
	}, [pageState, pageState.title])

	// Automatically connect/disconnect socket based on authentication state.
	useEffect(() => {
		if (isAuthenticated) {
			connect()
		} else {
			disconnect()
		}
	}, [isAuthenticated, connect, disconnect])

	return (
		<Router>
			<NotificationList />

			<Routes>
				<Route path="/login" element={<LoginContainer />} />
				<Route path="/signup" element={<SignupContainer />} />
				<Route
					path="/forgot-password"
					element={<ForgotPasswordContainer />}
				/>

				{/* Protected Routes */}
				<Route element={<ProtectedRoute />}>
					<Route
						path="/dashboard"
						element={
							<PlantProvider>
								<DashboardContainer />
							</PlantProvider>
						}
					/>
				</Route>

				<Route path="*" element={<LoginContainer />} />
			</Routes>
		</Router>
	)
}

/**
 * Main application component that handles authentication and page state.
 *
 * @return The main application component.
 */
const Application: React.FC = () => {
	return (
		<AuthenticationProvider>
			<SocketProvider>
				<PageProvider>
					<AppContent />
				</PageProvider>
			</SocketProvider>
		</AuthenticationProvider>
	)
}

export default Application
