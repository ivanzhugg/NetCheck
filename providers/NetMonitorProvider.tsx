import { useNetMonitorCore } from '@/hooks/useNetMonitorCore'
import React, { createContext, useContext } from 'react'

const NetMonitorContext = createContext<ReturnType<
	typeof useNetMonitorCore
> | null>(null)

export function NetMonitorProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const monitor = useNetMonitorCore(5000)
	return (
		<NetMonitorContext.Provider value={monitor}>
			{children}
		</NetMonitorContext.Provider>
	)
}

export function useNetMonitor() {
	const ctx = useContext(NetMonitorContext)
	if (!ctx) {
		throw new Error('useNetMonitor must be used inside NetMonitorProvider')
	}
	return ctx
}
