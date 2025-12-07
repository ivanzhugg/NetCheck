function sleep(ms: number) {
	return new Promise<void>(resolve => setTimeout(resolve, ms))
}

export async function checkUrl(
	url: string,
	timeoutMs = 5000,
	retries = 2
): Promise<boolean> {
	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			const ctrl = new AbortController()
			const t = setTimeout(() => ctrl.abort(), timeoutMs)

			let res = await fetch(url, { method: 'HEAD', signal: ctrl.signal })

			if (res.status === 405 || res.status === 501) {
				res = await fetch(url, { method: 'GET', signal: ctrl.signal })
			}

			clearTimeout(t)

			return true
		} catch (e) {
			if (attempt < retries) {
				await sleep(500)
				continue
			}
			return false
		}
	}

	return false
}
