import React, { useEffect, useMemo } from 'react'

import { PageAction } from 'Client/Data/Constants.js'
import { useAuth } from 'Client/Contexts/Authentication/index.js'
import { usePage } from 'Client/Contexts/Page/index.js'
import { useSocket } from 'Client/Contexts/Socket/index.js'
import { usePlant } from 'Client/Contexts/Plant/index.js'

import { calculateSystemStatus } from './Helper.js'

import MonitorPanel from 'Client/Components/Dashboard/MonitorPanel.js'
import ControlPanel from 'Client/Components/Dashboard/ControlPanel.js'
import HistoryChart from 'Client/Components/Dashboard/HistoryChart.js'

/**
 * Container component for the Dashboard page.
 * Manages logic and renders the dashboard layout using sub-components.
 *
 * @return The DashboardContainer component.
 */
const DashboardContainer: React.FC = () => {
	const { user, logout } = useAuth()
	const { dispatch } = usePage()

	// Consume everything from the unified PlantContext
	const { currentReadings, recordHistory, isPumpActive, thresholds } =
		usePlant()
	const { socket } = useSocket()

	/**
	 * Effect to set the page title on mount.
	 */
	useEffect(() => {
		dispatch({
			type: PageAction.SetPageTitle,
			payload: 'Smart Farm Dashboard',
		})
	}, [dispatch])

	/**
	 * Memoized system status based on readings and thresholds.
	 */
	const systemStatus = useMemo(
		() => calculateSystemStatus(currentReadings, thresholds),
		[currentReadings, thresholds]
	)

	return (
		<div className="dashboard-container">
			{/* Header Section */}
			<div className="dashboard-header">
				<div>
					<h1 style={{ margin: 0 }}>Smart Farm Monitor</h1>
					<small>
						User: {user?.username} | Connection:{' '}
						{socket ? 'Online' : 'Offline'}
					</small>
				</div>
				<button
					className="submit-btn"
					style={{ width: 'auto', backgroundColor: '#666' }}
					onClick={logout}
				>
					Logout
				</button>
			</div>

			{/* Main Content Grid */}
			<div className="dashboard-grid">
				<MonitorPanel
					readings={currentReadings}
					isPumpActive={isPumpActive}
					systemStatus={systemStatus}
				/>

				<ControlPanel />
			</div>

			{/* Charts Section */}
			<HistoryChart data={recordHistory} />
		</div>
	)
}

export default DashboardContainer
