import { ensureNotifPermissions } from '@/lib/notifications'
import { useNetMonitor } from '@/providers/NetMonitorProvider'
import React, { useEffect, useRef, useState } from 'react'
import {
	Animated,
	Easing,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'

let duration = 8000
let animation_time = 600

function CosmicLoader() {
	const dot1 = useRef(new Animated.Value(0)).current
	const dot2 = useRef(new Animated.Value(0)).current
	const dot3 = useRef(new Animated.Value(0)).current

	const createLoop = (value: Animated.Value, delay: number) => {
		return Animated.loop(
			Animated.sequence([
				Animated.delay(delay),
				Animated.timing(value, {
					toValue: 1,
					duration: animation_time,
					easing: Easing.out(Easing.quad),
					useNativeDriver: true,
				}),
				Animated.timing(value, {
					toValue: 0,
					duration: animation_time,
					easing: Easing.in(Easing.quad),
					useNativeDriver: true,
				}),
			])
		)
	}

	useEffect(() => {
		const loop1 = createLoop(dot1, 0)
		const loop2 = createLoop(dot2, 150)
		const loop3 = createLoop(dot3, 300)

		loop1.start()
		loop2.start()
		loop3.start()

		return () => {
			loop1.stop()
			loop2.stop()
			loop3.stop()
		}
	}, [dot1, dot2, dot3])

	const makeStyle = (v: Animated.Value) => ({
		transform: [
			{
				scale: v.interpolate({
					inputRange: [0, 1],
					outputRange: [1, 1.4],
				}),
			},
		],
		opacity: v.interpolate({
			inputRange: [0, 1],
			outputRange: [0.4, 1],
		}),
	})

	return (
		<View style={styles.loaderContainer}>
			<Animated.View style={[styles.loaderDot, makeStyle(dot1)]} />
			<Animated.View style={[styles.loaderDot, makeStyle(dot2)]} />
			<Animated.View style={[styles.loaderDot, makeStyle(dot3)]} />
		</View>
	)
}

export default function HomeScreen() {
	const { level, percent, refer } = useNetMonitor()
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		ensureNotifPermissions()
	}, [])

	let color: string
	if (isLoading) {
		color = '#A855F7'
	} else if (level === '100') color = '#22C55E'
	else if (level === '70') color = '#FACC15'
	else if (level === '40') color = '#FB923C'
	else color = '#FB4B5C'

	const handleRefresh = async () => {
		if (isLoading) return

		setIsLoading(true)
		const started = Date.now()

		try {
			await refer()
		} finally {
			const elapsed = Date.now() - started
			const delay = Math.max(0, duration - elapsed) // минимум 4 секунды
			setTimeout(() => {
				setIsLoading(false)
			}, delay)
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Состояние сети</Text>

			<View style={[styles.square, { backgroundColor: color }]}>
				{isLoading ? (
					<CosmicLoader />
				) : (
					<Text style={styles.percentText}>{percent}%</Text>
				)}
			</View>

			<TouchableOpacity style={styles.button} onPress={handleRefresh}>
				<Text style={styles.buttonText}>
					{isLoading ? 'Проверяем…' : 'Проверить сейчас'}
				</Text>
			</TouchableOpacity>

			<Text style={styles.caption}>Нажми, чтобы обновить вручную.</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
		backgroundColor: '#030914',
	},
	title: {
		fontSize: 24,
		fontWeight: '800',
		marginBottom: 16,
		color: '#E5E7EB',
	},
	square: {
		width: 220,
		height: 220,
		borderRadius: 32,
		marginBottom: 20,
		shadowColor: '#000',
		shadowOpacity: 0.35,
		shadowRadius: 18,
		elevation: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},
	percentText: {
		fontSize: 48,
		fontWeight: '900',
		color: '#FFFFFF',
	},
	button: {
		backgroundColor: '#A855F7',
		paddingVertical: 12,
		paddingHorizontal: 22,
		borderRadius: 999,
	},
	buttonText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: '700',
	},
	caption: {
		marginTop: 12,
		color: '#9CA3AF',
		textAlign: 'center',
	},
	loaderContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	loaderDot: {
		width: 14,
		height: 14,
		borderRadius: 7,
		backgroundColor: '#E5E7EB',
		marginHorizontal: 6,
	},
})
