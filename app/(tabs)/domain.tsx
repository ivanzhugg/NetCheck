import { Domains } from '@/constants/domains'
import { useNetMonitor } from '@/providers/NetMonitorProvider'
import { FlatList, StyleSheet, Text, View } from 'react-native'

export default function DomainsScreen() {
	const { status, refer } = useNetMonitor()

	return (
		<View style={styles.container}>
			<FlatList
				data={Domains}
				keyExtractor={i => i.id}
				onRefresh={refer}
				refreshing={false}
				contentContainerStyle={{ padding: 16 }}
				renderItem={({ item }) => {
					const isUp = status[item.id]

					return (
						<View style={styles.card}>
							<View
								style={[
									styles.dot,
									{ backgroundColor: isUp ? '#22C55E' : '#FB4B5C' },
								]}
							/>
							<View style={{ flex: 1 }}>
								<Text style={styles.label}>{item.label}</Text>
								<Text style={styles.url}>{item.url}</Text>
							</View>
							<Text
								style={[
									styles.state,
									isUp
										? {
												color: '#22C55E',
												backgroundColor: 'rgba(34,197,94,0.12)',
										  }
										: {
												color: '#FB4B5C',
												backgroundColor: 'rgba(251,75,92,0.16)',
										  },
								]}
							>
								{isUp ? 'UP' : 'DOWN'}
							</Text>
						</View>
					)
				}}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#030914',
	},
	card: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		backgroundColor: '#050818',
		padding: 16,
		borderRadius: 16,
		marginBottom: 12,
		shadowColor: '#000',
		shadowOpacity: 0.7,
		shadowRadius: 12,
		elevation: 6,
	},
	dot: {
		width: 16,
		height: 16,
		borderRadius: 8,
	},
	label: {
		fontSize: 16,
		fontWeight: '700',
		color: '#F9FAFB',
	},
	url: {
		fontSize: 13,
		color: '#9CA3AF',
		marginTop: 2,
	},
	state: {
		fontSize: 14,
		fontWeight: '800',
		paddingVertical: 4,
		paddingHorizontal: 10,
		borderRadius: 999,
	},
})
