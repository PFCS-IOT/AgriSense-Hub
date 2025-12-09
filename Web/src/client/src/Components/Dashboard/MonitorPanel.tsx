import React from 'react'

import type { SensorData } from 'Shared/Data/Types/index.js'

/**
 * MonitorPanel component to display real-time sensor data and system status.
 *
 * @param props - The props for the MonitorPanel component.
 * @return The MonitorPanel component.
 */
const MonitorPanel: React.FC<{
	readings: SensorData | null
	isPumpActive: boolean
	systemStatus: { text: string; class: string }
}> = ({ readings, isPumpActive, systemStatus }) => {
	return (
		<div className="panel monitor-panel">
			<h2>Environment Monitor</h2>
			<div className="monitor-list">
				<div className="monitor-item">
					<span>Temperature</span>
					<span
						className="monitor-value"
						style={{ color: '#e74c3c' }}
					>
						{readings
							? `${readings.temperature.toFixed(1)} °C`
							: '--'}
					</span>
				</div>
				<div className="monitor-item">
					<span>Soil Moisture</span>
					<span
						className="monitor-value"
						style={{ color: '#387908' }}
					>
						{readings ? `${readings.moisture.toFixed(1)} %` : '--'}
					</span>
				</div>
				<div className="monitor-item">
					<span>Humidity</span>
					<span
						className="monitor-value"
						style={{ color: '#3498db' }}
					>
						{readings ? `${readings.humidity.toFixed(1)} %` : '--'}
					</span>
				</div>
				<hr
					style={{
						width: '100%',
						borderColor: '#eee',
						margin: '10px 0',
					}}
				/>
				<div className="monitor-item">
					<span>Pump Status</span>
					<span
						className={`monitor-value ${isPumpActive ? 'status-good' : ''}`}
					>
						{isPumpActive ? 'Active (On)' : 'Inactive (Off)'}
					</span>
				</div>
				<div className="monitor-item">
					<span>System Status</span>
					<span className={`monitor-value ${systemStatus.class}`}>
						{systemStatus.text}
					</span>
				</div>
			</div>
		</div>
	)
}

export default MonitorPanel
