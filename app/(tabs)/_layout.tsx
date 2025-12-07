import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: '#A855F7',
				tabBarInactiveTintColor: '#6B7280',
				tabBarStyle: {
					backgroundColor: '#020617',
					borderTopColor: '#111827',
				},
			}}
		>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Home',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='home-outline' size={size} color={color} />
					),
				}}
			/>

			<Tabs.Screen
				name='domain'
				options={{
					title: 'Services',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='planet-outline' size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	)
}
