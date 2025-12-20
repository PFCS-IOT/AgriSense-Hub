import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { AuthenticationProvider } from 'Client/Contexts/Authentication/index.js'
import { usePage, PageProvider } from 'Client/Contexts/Page/index.js'
import { SocketProvider } from 'Client/Contexts/Socket/index.ts'
import { SensorProvider } from 'Client/Contexts/Sensor/index.js'
import ProtectedRoute from 'Client/Components/ProtectedRoute.js'
import NotificationList from 'Client/Components/NotificationList.js'

import LoginContainer from 'Client/Containers/Login/index.js'
import SignupContainer from 'Client/Containers/Signup/index.js'
import DashboardContainer from 'Client/Containers/Dashboard/index.js'

const AppContent: React.FC = () => {
	const { pageState } = usePage()

	// Update document title based on page state
	useEffect(() => {
		document.title = pageState.title
	}, [pageState, pageState.title])

	return (
		<Router>
			<NotificationList />

			<Routes>
				<Route path="/login" element={<LoginContainer />} />
				<Route path="/signup" element={<SignupContainer />} />

				{/* Protected Routes */}
				<Route element={<ProtectedRoute />}>
					<Route
						path="/dashboard"
						element={
							<SocketProvider>
								<SensorProvider>
									<DashboardContainer />
								</SensorProvider>
							</SocketProvider>
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
			<PageProvider>
				<AppContent />
			</PageProvider>
		</AuthenticationProvider>
	)
}

export default Application
