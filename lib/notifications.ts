import * as Notifications from 'expo-notifications'

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
		shouldShowBanner: true,
		shouldShowNotification: true,
		shouldShowList: true,
	}),
})

export async function ensureNotifPermissions() {
	const { status } = await Notifications.getPermissionsAsync()
	if (status !== 'granted') {
		await Notifications.requestPermissionsAsync()
	}
}

export async function notifyDown(label: string) {
	await Notifications.scheduleNotificationAsync({
		content: {
			title: label,
		},
		trigger: null,
	})
}
