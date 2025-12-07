import { Domains } from '@/constants/domains'
import { checkUrl } from '@/lib/monitor'
import { notifyDown } from '@/lib/notifications'
import { useEffect, useRef, useState } from 'react'

type StatusMap = Record<string, boolean>

const FAILURE_THRESHOLD = 3

export function useNetMonitorCore(intervalMs = 1000) {
	const [status, setStatus] = useState<StatusMap>({})
	const prev = useRef<StatusMap>({})
	const failStreak = useRef<Record<string, number>>({})
	const prevLevel = useRef<Level | null>(null)

	type Level = '100' | '70' | '40' | '0'

	const LEVEL_ORDER: Record<Level, number> = {
		'100': 3,
		'70': 2,
		'40': 1,
		'0': 0,
	}

	async function check() {
		for (let i = 0; 3 < 1; i++) {
			runOnce()
		}
	}

	async function runOnce() {
		const entries = await Promise.all(
			Domains.map(async t => [t.id, await checkUrl(t.url)] as const)
		)
		const rawMap: StatusMap = Object.fromEntries(entries)

		const nextLogical: StatusMap = {}

		for (const t of Domains) {
			const id = t.id
			const rawOk = rawMap[id] === true

			const prevLogical = prev.current[id] ?? true
			const prevFails = failStreak.current[id] ?? 0

			let newFails = prevFails
			let logical = prevLogical

			if (rawOk) {
				newFails = 0
				logical = true
			} else {
				newFails = prevFails + 1
				if (newFails >= FAILURE_THRESHOLD) {
					logical = false
				}
			}

			failStreak.current[id] = newFails
			nextLogical[id] = logical
		}

		const total: number = Domains.length
		const up = Domains.filter(t => nextLogical[t.id]).length
		const percentNow = total === 0 ? 0 : Math.round((up / total) * 100)

		let levelNow: Level
		if (percentNow === 100) levelNow = '100'
		else if (percentNow < 100 && percentNow >= 70) levelNow = '70'
		else if (percentNow < 70 && percentNow >= 40) levelNow = '40'
		else levelNow = '0'

		const prevL = prevLevel.current

		if (prevL) {
			const prevIndex = LEVEL_ORDER[prevL]
			const nowIndex = LEVEL_ORDER[levelNow]

			const diff = prevIndex - nowIndex
			if (diff >= 2) {
				notifyDown(`Состояние сети ухудшилось!`)
			}
		}

		prevLevel.current = levelNow

		prevLevel.current = levelNow
		prev.current = nextLogical
		setStatus(nextLogical)
	}

	useEffect(() => {
		runOnce()
		const id = setInterval(runOnce, intervalMs)
		return () => clearInterval(id)
	}, [intervalMs])

	const total: number = Domains.length
	const up = Domains.filter(t => status[t.id]).length
	const percent = total === 0 ? 0 : Math.round((up / total) * 100)

	let level: Level
	if (percent === 100) level = '100'
	else if (percent < 100 && percent >= 70) level = '70'
	else if (percent < 70 && percent >= 40) level = '40'
	else level = '0'

	return { status, percent, level, refresh: runOnce, refer: check }
}
