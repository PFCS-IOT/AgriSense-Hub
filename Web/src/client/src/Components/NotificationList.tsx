import React from 'react'
import { usePage } from 'Client/Contexts/Page/index.js'
import { PageAction } from 'Client/Data/Constants.js'

/**
 * Component to display notifications.
 *
 * @return The NotificationList component.
 */
const NotificationList: React.FC = () => {
	const { pageState, dispatch } = usePage()

	const handleClose = (id: string) => {
		dispatch({ type: PageAction.RemoveNotification, payload: id })
	}

	if (pageState.notifications.length === 0) return null

	return (
		<div className="notification-container">
			{pageState.notifications.map((note) => (
				<div
					key={note.id}
					className={`notification-toast ${note.type}`}
				>
					<div className="notification-content">{note.message}</div>
					<button
						className="notification-close"
						onClick={() => handleClose(note.id)}
						aria-label="Close"
					>
						&times;
					</button>
				</div>
			))}
		</div>
	)
}

export default NotificationList
